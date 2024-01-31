using SoupApi.Models;

namespace SoupApi.Dtos
{
    public class PaidProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime Schedule { get; set; }
        public string Image { get; set; } = string.Empty;
    }
}
