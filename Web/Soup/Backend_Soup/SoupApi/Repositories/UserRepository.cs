using MySql.Data.MySqlClient;
using SoupApi.Dtos;
using SoupApi.Models;

namespace SoupApi.Repositories
{
    public class UserRepository
    {
        private string _connectionString;
        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Default");
        }

        public User? GetByEmailAndPassword(string email, string password)
        {
            User? user = null;

            //get connection to database
            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                // able to query after open
                // Perform database operations
                MySqlCommand cmd = new MySqlCommand("SELECT id, email, role, isConfirmed FROM user WHERE email=@Email and password=@Password and isActivated=1", conn);
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Password", password);

                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    user = new User();
                    user.Id = reader.GetInt32("id");
                    user.Email = reader.GetString("email");
                    user.Role = reader.GetString("role");
                    user.isConfirmed = reader.GetBoolean("isConfirmed");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            //required
            conn.Close();

            return user;
        }

        public List<UserGetDto> GetAllUsersAdmin()
        {
            List<UserGetDto> users = new List<UserGetDto>();

            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                string sql = "SELECT* FROM user";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    users.Add(new UserGetDto()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        Email = reader.GetString("email"),
                        Role = reader.GetString("role"),
                        IsActivated = reader.GetBoolean("isActivated")
                    });
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            conn.Close();

            return users;
        }

        public User? GetByToken(string token)
        {
            User? user = null;

            //get connection to database
            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                // able to query after open
                // Perform database operations
                MySqlCommand cmd = new MySqlCommand("SELECT id, email, token FROM user WHERE token=@Token", conn);
                cmd.Parameters.AddWithValue("@Token", token);

                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    user = new User();
                    user.Id = reader.GetInt32("id");
                    user.Email = reader.GetString("email");
                    user.Token = reader.GetString("token");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            //required
            conn.Close();

            return user;
        }

        public string RegisterUser(string name, string email, string password, string verificationToken)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("SELECT email FROM user WHERE email=@Email", conn);
                cmd.Parameters.AddWithValue("@Email", email);
                MySqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    reader.Close();
                    throw new Exception("Email sudah digunakan, mohon gunakan email lain");
                }
                reader.Close();

                string sql = "INSERT INTO user (name, email, password, role, token) VALUES (@Name, @Email, @Password, 'user', @Token)";
                cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Name", name);
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Password", password);
                cmd.Parameters.AddWithValue("@Token", verificationToken);
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

        public string RegisterUserAdmin(string name, string email, string password, string role)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("SELECT email FROM user WHERE email=@Email", conn);
                cmd.Parameters.AddWithValue("@Email", email);
                MySqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    reader.Close();
                    throw new Exception("Email sudah digunakan, mohon gunakan email lain");
                }
                reader.Close();

                string sql = "INSERT INTO user (name, email, password, role, IsConfirmed) VALUES (@Name, @Email, @Password, @Role, 1)";
                cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Name", name);
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Password", password);
                cmd.Parameters.AddWithValue("@Role", role);
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

        public string UpdateUserAdmin(int id, string name, string email, string role)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE user SET name=@Name, email=@Email, role=@Role WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Name", name);
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Role", role);
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

        public string UpdateIsActivated(int id, bool isActivated)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE user SET isActivated=@IsActivated WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@IsActivated", isActivated);
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

        public string Activate(int userId)
        {
            string errorMessage = string.Empty;

            //get connection to database
            MySqlConnection conn = new MySqlConnection(_connectionString);

            conn.Open();

            MySqlTransaction transaction = conn.BeginTransaction();

            try
            {
                MySqlCommand cmd = new MySqlCommand("UPDATE user SET IsConfirmed=1 WHERE id=@UserId", conn);
                cmd.Transaction = transaction;
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.ExecuteNonQuery();

                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                errorMessage = ex.Message;
                Console.WriteLine(ex.ToString());
            }
            finally
            {
                //required
                conn.Close();
            }

            return errorMessage;
        }

        public string RequestResetPassword(string email, string token)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE user SET token_password=@Token WHERE email=@Email";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Token", token);
                cmd.Parameters.AddWithValue("@Email", email);
                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected < 1)
                {
                    throw new Exception("Email tidak ditemukan");
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

        public string ChangePassword(string token, string password)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE user SET password=@Password WHERE token_password=@Token";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Token", token);
                cmd.Parameters.AddWithValue("@Password", password);
                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected < 1)
                {
                    throw new Exception("Something wrong occured");
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
