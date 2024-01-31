namespace SoupApi.Dtos
{
    public class ProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Price { get; set; }
        public IFormFile? Image { get; set; }
        public int fk_id_category { get; set; }
    }
}
