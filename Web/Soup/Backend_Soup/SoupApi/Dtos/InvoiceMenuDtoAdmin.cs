using SoupApi.Models;

namespace SoupApi.Dtos
{
    public class InvoiceMenuDtoAdmin
    {
        public int Id_Invoice { get; set; }
        public int Id_User { get; set; }
        public DateTime Created_at { get; set; }
        public int Total_product { get; set; }
        public int Total_price { get; set; }
    }
}
