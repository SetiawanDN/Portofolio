using SoupApi.Models;

namespace SoupApi.Dtos
{
    public class InvoiceMenuDto
    {
        public int Id { get; set; }
        public DateTime Created_at { get; set; }
        public int Total_product { get; set; }
        public int Total_price { get; set; }
    }
}
