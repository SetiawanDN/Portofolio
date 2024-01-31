using MySql.Data.MySqlClient;
using SoupApi.Models;

namespace SoupApi.Repositories
{
    public class PaymentMethodRepository
    {
        private readonly string _connectionString = string.Empty;
        public PaymentMethodRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Default");
        }

        public List<PaymentMethod> GetAll()
        {
            List<PaymentMethod> payments = new List<PaymentMethod>();

            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                string sql = "SELECT* FROM payment_method WHERE isActivated=1";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    payments.Add(new PaymentMethod()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
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

            return payments;
        }

        public List<PaymentMethod> GetAllAdmin()
        {
            List<PaymentMethod> payments = new List<PaymentMethod>();

            MySqlConnection conn = new MySqlConnection(_connectionString);
            try
            {
                conn.Open();
                string sql = "SELECT* FROM payment_method";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    payments.Add(new PaymentMethod()
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
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

            return payments;
        }

        public string Create(PaymentMethod payment)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "INSERT INTO payment_method (name, image) VALUES (@Name, @Image)";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Name", payment.Name);
                cmd.Parameters.AddWithValue("@Image", payment.Image);
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

        public string Update(PaymentMethod payment)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE payment_method SET name=@Name, image=@Image WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", payment.Id);
                cmd.Parameters.AddWithValue("@Name", payment.Name);
                cmd.Parameters.AddWithValue("@Image", payment.Image);
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

        public string UpdateIsActivated(PaymentMethod payment)
        {
            MySqlConnection conn = new MySqlConnection(_connectionString);
            string errorMessage = string.Empty;
            try
            {
                conn.Open();
                string sql = "UPDATE payment_method SET isActivated=@IsActivated WHERE id=@Id";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", payment.Id);
                cmd.Parameters.AddWithValue("@IsActivated", payment.IsActivated);
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
                string sql = "SELECT image FROM payment_method WHERE id=@Id";
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
