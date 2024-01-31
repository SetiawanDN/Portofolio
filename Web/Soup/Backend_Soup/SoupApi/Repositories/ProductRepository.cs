using MySql.Data.MySqlClient;
using SoupApi.Dtos;
using SoupApi.Models;

namespace SoupApi.Repositories
{
    public class ProductRepository
    {
        private readonly string _connectionString = string.Empty;
        public ProductRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Default");
        }

        public List<Product> GetAll()
        {
            List<Product> products = new List<Product>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT* FROM product WHERE isActivated=1";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    products.Add(new Product()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        Price = reader.GetInt32("price"),
                        Image = reader.GetString("image"),
                        Fk_id_category = reader.GetInt32("fk_id_category"),
                        IsActivated = reader.GetBoolean("isActivated")
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            conn.Close();

            return products;
        }

        public List<Product> GetAllAdmin()
        {
            List<Product> products = new List<Product>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT* FROM product";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    products.Add(new Product()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        Price = reader.GetInt32("price"),
                        Image = reader.GetString("image"),
                        Fk_id_category = reader.GetInt32("fk_id_category"),
                        IsActivated = reader.GetBoolean("isActivated")
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            conn.Close();

            return products;
        }

        public List<ProductByCategoryDto> GetLimit6Random()
        {
            List<ProductByCategoryDto> products = new List<ProductByCategoryDto>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT product.id AS id, product.name AS NAME, product.description AS DESCRIPTION, price, product.image AS image, category.id AS category_id, category.name AS category_name FROM product JOIN category ON product.fk_id_category = category.id WHERE product.isActivated=1 AND category.isActivated=1 ORDER BY RAND() LIMIT 6";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    products.Add(new ProductByCategoryDto()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        Price = reader.GetInt32("price"),
                        Image = reader.GetString("image"),
                        Category_id = reader.GetInt32("category_id"),
                        Category_name = reader.GetString("category_name"),
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            conn.Close();

            return products;
        }

        public List<ProductByCategoryDto> GetByCategoryId(int category_id)
        {
            List<ProductByCategoryDto> products = new List<ProductByCategoryDto>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT product.id AS id, product.name AS NAME, product.description AS DESCRIPTION, price, product.image AS image, category.id AS category_id, category.name AS category_name FROM product JOIN category ON product.fk_id_category = category.id WHERE category.id=@Category_id AND product.isActivated=1 AND category.isActivated=1";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Category_id", category_id);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    products.Add(new ProductByCategoryDto()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        Price = reader.GetInt32("price"),
                        Image = reader.GetString("image"),
                        Category_id = reader.GetInt32("category_id"),
                        Category_name = reader.GetString("category_name"),
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            conn.Close();

            return products;
        }

        public List<ProductByCategoryDtoAdmin> GetByCategoryIdAdmin(int category_id)
        {
            List<ProductByCategoryDtoAdmin> products = new List<ProductByCategoryDtoAdmin>();

            MySqlConnection conn = new MySqlConnection(_connectionString);

            try
            {
                conn.Open();
                string sql = "SELECT product.id AS id, product.name AS NAME, product.description AS DESCRIPTION, price, product.image AS image, category.id AS category_id, category.name AS category_name, product.isActivated AS isActivated FROM product JOIN category ON product.fk_id_category = category.id WHERE category.id=@Category_id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Category_id", category_id);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    products.Add(new ProductByCategoryDtoAdmin()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        Price = reader.GetInt32("price"),
                        Image = reader.GetString("image"),
                        Category_id = reader.GetInt32("category_id"),
                        Category_name = reader.GetString("category_name"),
                        IsActivated = reader.GetBoolean("isActivated")
                    });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            conn.Close();

            return products;
        }

        public string Create(Product product)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "INSERT INTO product (name, description, price, image, fk_id_category) VALUES (@Name, @Description, @Price, @Image, @Fk_id_category)";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Name", product.Name);
                cmd.Parameters.AddWithValue("@Description", product.Description);
                cmd.Parameters.AddWithValue("@Price", product.Price);
                cmd.Parameters.AddWithValue("@Image", product.Image);
                cmd.Parameters.AddWithValue("@Fk_id_category", product.Fk_id_category);
                cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                errorMessage = e.Message;
                Console.WriteLine(e.ToString());
            }
            conn.Close();
            return errorMessage;
        }

        public string Update(Product product)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE product SET name=@Name, description=@Description, price=@Price, image=@Image, fk_id_category=@Fk_id_category WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", product.Id);
                cmd.Parameters.AddWithValue("@Name", product.Name);
                cmd.Parameters.AddWithValue("@Description", product.Description);
                cmd.Parameters.AddWithValue("@Price", product.Price);
                cmd.Parameters.AddWithValue("@Image", product.Image);
                cmd.Parameters.AddWithValue("@Fk_id_category", product.Fk_id_category);
                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected < 1)
                {
                    throw new Exception("Failed to Update Data");
                }
            }
            catch (Exception e)
            {
                errorMessage = e.Message;
                Console.WriteLine(e.ToString());
            }
            conn.Close();
            return errorMessage;
        }

        public string UpdateIsActivated(Product product)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE product SET isActivated=@IsActivated WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", product.Id);
                cmd.Parameters.AddWithValue("@IsActivated", product.IsActivated);
                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected < 1)
                {
                    throw new Exception("Failed to Update Data");
                }
            }
            catch (Exception e)
            {
                errorMessage = e.Message;
                Console.WriteLine(e.ToString());
            }
            conn.Close();
            return errorMessage;
        }

        public string GetImage(int id)
        {
            string img = string.Empty;
            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                string sql = "SELECT image FROM product WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    img = reader.GetString("image");
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            conn.Close();

            return img;
        }
    }
}
