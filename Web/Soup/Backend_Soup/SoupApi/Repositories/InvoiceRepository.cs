using MySql.Data.MySqlClient;
using SoupApi.Dtos;
using SoupApi.Models;
using System.Transactions;

namespace SoupApi.Repositories
{
    public class InvoiceRepository
    {
        private readonly string _connectionString = string.Empty;
        public InvoiceRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Default");
        }

        public string Create(int fk_id_payment_method, int fk_id_user, List<Cart> cartsParam)
        {
            List<Cart> carts = cartsParam;
            string errorMessage = string.Empty;
            MySqlConnection conn = new MySqlConnection(_connectionString);
            conn.Open();
            MySqlTransaction transaction = conn.BeginTransaction();
            try
            {
                string sql = "INSERT INTO  invoice (fk_id_user, fk_id_payment_method) VALUES (@Fk_id_user, @Fk_id_payment_method)";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_user", fk_id_user);
                cmd.Parameters.AddWithValue("@Fk_id_payment_method", fk_id_payment_method);
                cmd.ExecuteNonQuery();

                long lastInsertedId = cmd.LastInsertedId;

                foreach (Cart cart in carts)
                {
                    sql = "INSERT INTO  invoice_details (fk_id_invoice, fk_id_product, cost_per_product, schedule) VALUES (@Fk_id_invoice, @Fk_id_product, @Cost_per_product, @Schedule)";
                    cmd = new MySqlCommand(sql, conn);
                    cmd.Parameters.AddWithValue("@Fk_id_invoice", lastInsertedId);
                    cmd.Parameters.AddWithValue("@Fk_id_product", cart.Product.Id);
                    cmd.Parameters.AddWithValue("@Cost_per_product", cart.Product.Price);
                    cmd.Parameters.AddWithValue("@Schedule", cart.Schedule);
                    cmd.ExecuteNonQuery();

                    sql = "UPDATE cart SET isActivated=@IsActivated, updated_at=default, isPaid=1 WHERE id=@Id";
                    cmd = new MySqlCommand(sql, conn);
                    cmd.Parameters.AddWithValue("@Id", cart.Id);
                    cmd.Parameters.AddWithValue("@IsActivated", false);
                    cmd.ExecuteNonQuery();
                }
                transaction.Commit();

            }
            catch (Exception e)
            {
                transaction.Rollback();
                errorMessage = e.Message;
                Console.WriteLine(e.ToString());
            }
            finally
            {
                conn.Close();
            }
            return errorMessage;
        }

        public string BuyNow(int fk_id_payment_method, int fk_id_user, int fk_id_product, DateTime schedule)
        {
            string errorMessage = string.Empty;
            MySqlConnection conn = new MySqlConnection(_connectionString);
            conn.Open();
            MySqlTransaction transaction = conn.BeginTransaction();
            try
            {
                //ngecek apakah user menambahkan kelas pada jadwal yang sama atau tidak
                string sql = "SELECT* FROM cart WHERE fk_id_user=@Fk_id_user AND fk_id_product=@Fk_id_product AND SCHEDULE=@Schedule AND (isActivated=1 OR  isPaid=1)";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_user", fk_id_user);
                cmd.Parameters.AddWithValue("@Fk_id_product", fk_id_product);
                cmd.Parameters.AddWithValue("@Schedule", schedule);
                MySqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    reader.Close();
                    throw new Exception("User menambahkan kelas yang sama pada jadwal yang sama");
                }

                reader.Close();

                //membuat cart dalam kondisi sudah terpaid karena melalui buy now
                sql = "INSERT INTO  cart (fk_id_user, fk_id_product, schedule, isPaid, isActivated) VALUES (@Fk_id_user, @Fk_id_product, @Schedule, 1, 0)";
                cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_user", fk_id_user);
                cmd.Parameters.AddWithValue("@Fk_id_product", fk_id_product);
                cmd.Parameters.AddWithValue("@Schedule", schedule);
                cmd.ExecuteNonQuery();

                //mengambil cost per product
                sql = "select price from product where id=@Fk_id_product and isActivated=1";
                cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_product", fk_id_product);
                reader = cmd.ExecuteReader();

                int cost_per_product = 0;
                while (reader.Read())
                {
                    cost_per_product = reader.GetInt32("price");
                }
                reader.Close();

                //membuat invoice
                sql = "INSERT INTO  invoice (fk_id_user, fk_id_payment_method) VALUES (@Fk_id_user, @Fk_id_payment_method)";
                cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_user", fk_id_user);
                cmd.Parameters.AddWithValue("@Fk_id_payment_method", fk_id_payment_method);
                cmd.ExecuteNonQuery();

                long lastInsertedId = cmd.LastInsertedId;

                //membuat detail invoice
                sql = "INSERT INTO  invoice_details (fk_id_invoice, fk_id_product, cost_per_product, schedule) VALUES (@Fk_id_invoice, @Fk_id_product, @Cost_per_product, @Schedule)";
                cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_invoice", lastInsertedId);
                cmd.Parameters.AddWithValue("@Fk_id_product", fk_id_product);
                cmd.Parameters.AddWithValue("@Cost_per_product", cost_per_product);
                cmd.Parameters.AddWithValue("@Schedule", schedule);
                cmd.ExecuteNonQuery();

                transaction.Commit();

            }
            catch (Exception e)
            {
                transaction.Rollback();
                errorMessage = e.Message;
                Console.WriteLine(e.ToString());
            }
            finally
            {
                conn.Close();
            }
            return errorMessage;
        }

        public List<InvoiceMenuDto> GetInvoiceMenuByUserId(int fk_id_user)
        {
            List<InvoiceMenuDto> invoices = new List<InvoiceMenuDto>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT invoice.id, invoice.created_at, COUNT(invoice_details.id) AS 'total_product', SUM(invoice_details.cost_per_product) AS 'total_price' FROM invoice JOIN payment_method ON invoice.fk_id_payment_method = payment_method.id JOIN invoice_details ON invoice_details.fk_id_invoice = invoice.id WHERE invoice.fk_id_user=@Fk_id_user GROUP BY invoice.id ORDER BY invoice.created_at DESC";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_user", fk_id_user);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    invoices.Add(new InvoiceMenuDto()
                    {
                        Id = reader.GetInt32("id"),
                        Created_at = reader.GetDateTime("created_at"),
                        Total_product = reader.GetInt32("total_product"),
                        Total_price = reader.GetInt32("total_price"),
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            finally
            {
                conn.Close();
            }

            return invoices;
        }

        public List<InvoiceMenuDtoAdmin> GetInvoiceMenuAllAdmin()
        {
            List<InvoiceMenuDtoAdmin> invoices = new List<InvoiceMenuDtoAdmin>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT invoice.id as 'Id_Invoice', invoice.fk_id_user as 'Id_User', invoice.created_at, COUNT(invoice_details.id) AS 'total_product', SUM(invoice_details.cost_per_product) AS 'total_price' FROM invoice JOIN payment_method ON invoice.fk_id_payment_method = payment_method.id JOIN invoice_details ON invoice_details.fk_id_invoice = invoice.id GROUP BY invoice.id order by invoice.created_at desc ";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    invoices.Add(new InvoiceMenuDtoAdmin()
                    {
                        Id_Invoice = reader.GetInt32("Id_Invoice"),
                        Id_User = reader.GetInt32("Id_User"),
                        Created_at = reader.GetDateTime("created_at"),
                        Total_product = reader.GetInt32("total_product"),
                        Total_price = reader.GetInt32("total_price"),
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            finally
            {
                conn.Close();
            }

            return invoices;
        }

        public List<PaidProductDto> GetPaidProduct(int fk_id_user)
        {
            List<PaidProductDto> paidProducts = new List<PaidProductDto>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT product.name AS 'name', category.name AS 'category', SCHEDULE, product.image AS 'image' FROM invoice\r\nJOIN invoice_details ON invoice_details.fk_id_invoice = invoice.id\r\nJOIN product ON invoice_details.fk_id_product = product.id\r\nJOIN category ON product.fk_id_category = category.id\r\nWHERE invoice.fk_id_user=@Fk_id_user";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_user", fk_id_user);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    paidProducts.Add(new PaidProductDto()
                    {
                        Name = reader.GetString("name"),
                        Category = reader.GetString("category"),
                        Schedule = reader.GetDateTime("schedule"),
                        Image = reader.GetString("image"),
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            finally
            {
                conn.Close();
            }

            return paidProducts;
        }

        public List<InvoiceDetailsDto> GetInvoiceDetailsByInvoiceId(int fk_id_invoice)
        {
            List<InvoiceDetailsDto> invoices = new List<InvoiceDetailsDto>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT invoice_details.id, product.name AS 'product_name', category.name AS 'category_name', invoice_details.schedule, invoice_details.cost_per_product FROM invoice_details JOIN product ON invoice_details.fk_id_product = product.id JOIN category ON product.fk_id_category = category.id WHERE fk_id_invoice = @Fk_id_invoice";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_invoice", fk_id_invoice);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    invoices.Add(new InvoiceDetailsDto()
                    {
                        Id = reader.GetInt32("id"),
                        ProductName = reader.GetString("product_name"),
                        CategoryName = reader.GetString("category_name"),
                        Schedule = reader.GetDateTime("schedule"),
                        CostPerProduct = reader.GetInt32("cost_per_product"),
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            finally
            {
                conn.Close();
            }

            return invoices;
        }
    }
}
