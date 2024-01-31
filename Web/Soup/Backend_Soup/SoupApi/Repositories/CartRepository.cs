using MySql.Data.MySqlClient;
using SoupApi.Models;

namespace SoupApi.Repositories
{
    public class CartRepository
    {
        private readonly string _connectionString = string.Empty;
        public CartRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Default");
        }

        public List<Cart> GetCartsByUserId(int fk_id_user)
        {
            List<Cart> carts = new List<Cart>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT cart.id AS \"cart_id\", cart.fk_id_user, cart.fk_id_product, cart.schedule, cart.isPaid, cart.created_at, cart.updated_at, cart.isActivated AS \"cart_isActivated\", product.id AS \"product_id\", product.name, product.description, product.price, product.image, product.fk_id_category, product.isActivated AS \"product_isActivated\", category.name AS \"category_name\" FROM cart JOIN product ON cart.fk_id_product = product.id JOIN category ON product.fk_id_category = category.id WHERE fk_id_user = @Fk_id_user AND cart.isActivated = 1 AND product.isActivated = 1";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_user", fk_id_user);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    carts.Add(new Cart()
                    {
                        Id = reader.GetInt32("cart_id"),
                        Fk_id_user = reader.GetInt32("fk_id_user"),
                        Fk_id_product = reader.GetInt32("fk_id_product"),
                        Schedule = reader.GetDateTime("schedule"),
                        IsPaid = reader.GetBoolean("isPaid"),
                        Created_at = reader.GetDateTime("created_at"),
                        Updated_at = reader.GetDateTime("updated_at"),
                        IsActivated = reader.GetBoolean("cart_IsActivated"),

                        Product = new Product()
                        {
                            Id = reader.GetInt32("product_id"),
                            Name = reader.GetString("Name"),
                            Description = reader.GetString("Description"),
                            Price = reader.GetInt32("Price"),
                            Image = reader.GetString("Image"),
                            Fk_id_category = reader.GetInt32("Fk_id_category"),
                            IsActivated = reader.GetBoolean("product_IsActivated")
                        },
                        CategoryName = reader.GetString("category_name")
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

            return carts;
        }

        public string Create(int fk_id_user, int fk_id_product, DateTime schedule)
        {
            string errorMessage = string.Empty;
            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
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
                sql = "INSERT INTO  cart (fk_id_user, fk_id_product, schedule) VALUES (@Fk_id_user, @Fk_id_product, @Schedule)";
                cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Fk_id_user", fk_id_user);
                cmd.Parameters.AddWithValue("@Fk_id_product", fk_id_product);
                cmd.Parameters.AddWithValue("@Schedule", schedule);
                cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                errorMessage = e.Message;
                Console.WriteLine(e.ToString());
            }
            finally
            {
                conn.Close();
            }
            return errorMessage;
        }

        public string UpdateIsActivatedFalse(int id)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE cart SET isActivated=false WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected < 1)
                {
                    throw new Exception("Failed to Update Data");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                errorMessage = e.Message;
            }
            conn.Close();
            return errorMessage;
        }
    }
}
