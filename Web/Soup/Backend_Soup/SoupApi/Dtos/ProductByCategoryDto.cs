namespace SoupApi.Dtos
{
    public class ProductByCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Price { get; set; }
        public string Image { get; set; } = string.Empty;
        public int Category_id { get; set; }
        public string Category_name { get; set; } = string.Empty;
    }
}
