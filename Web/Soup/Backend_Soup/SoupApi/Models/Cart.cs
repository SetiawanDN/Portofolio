namespace SoupApi.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public int Fk_id_user { get; set; }
        public int Fk_id_product { get; set; }
        public DateTime Schedule { get; set; }
        public bool IsPaid { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime Updated_at { get; set; }
        public bool IsActivated { get; set; }

        public Product? Product { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}
