using MySql.Data.MySqlClient;
using SoupApi.Models;

namespace SoupApi.Repositories
{
    public class CategoryRepository
    {
        private readonly string _connectionString = string.Empty;
        public CategoryRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Default");
        }

        public List<Category> GetAll()
        {
            List<Category> categories = new List<Category>();

            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                string sql = "SELECT* FROM category WHERE isActivated=1";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    categories.Add(new Category()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        Image = reader.GetString("image"),
                        IsActivated = reader.GetBoolean("isActivated")
                    });
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            conn.Close();

            return categories;
        }

        public List<Category> GetAllAdmin()
        {
            List<Category> categories = new List<Category>();

            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                string sql = "SELECT* FROM category";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    categories.Add(new Category()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Description = reader.GetString("description"),
                        Image = reader.GetString("image"),
                        IsActivated = reader.GetBoolean("isActivated")
                    });
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            conn.Close();

            return categories;
        }

        public Category GetById(int id)
        {
            Category categories = new Category();

            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                string sql = "SELECT* FROM category WHERE isActivated=1 AND id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    categories.Id = reader.GetInt32("id");
                    categories.Name = reader.GetString("name");
                    categories.Description = reader.GetString("description");
                    categories.Image = reader.GetString("image");
                    categories.IsActivated = reader.GetBoolean("isActivated");
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            conn.Close();

            return categories;
        }

        public string Create(Category category)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "INSERT INTO category (name, description, image) VALUES (@Name, @Description, @Image)";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Name", category.Name);
                cmd.Parameters.AddWithValue("@Description", category.Description);
                cmd.Parameters.AddWithValue("@Image", category.Image);
                cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                errorMessage = e.Message;
            }
            conn.Close();
            return errorMessage;
        }

        public string Update(Category category)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE category SET name=@Name, description=@Description, image=@Image WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", category.Id);
                cmd.Parameters.AddWithValue("@Name", category.Name);
                cmd.Parameters.AddWithValue("@Description", category.Description);
                cmd.Parameters.AddWithValue("@Image", category.Image);
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

        public string UpdateIsActivated(Category category)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE category SET isActivated=@IsActivated WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", category.Id);
                cmd.Parameters.AddWithValue("@IsActivated", category.IsActivated);
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

        public string GetImage(int id)
        {
            string img = string.Empty;
            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                string sql = "SELECT image FROM category WHERE id=@Id";
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
