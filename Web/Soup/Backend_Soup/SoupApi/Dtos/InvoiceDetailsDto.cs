using SoupApi.Models;

namespace SoupApi.Dtos
{
    public class InvoiceDetailsDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public DateTime Schedule { get; set; }
        public int CostPerProduct { get; set; }
    }
}
