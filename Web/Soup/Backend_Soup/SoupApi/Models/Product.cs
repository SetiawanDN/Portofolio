namespace SoupApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Price { get; set; }
        public string Image { get; set; } = string.Empty;
        public int Fk_id_category { get; set; }
        public bool IsActivated { get; set; }
    }
}
