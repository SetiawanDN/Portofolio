using SoupApi.Models;

namespace SoupApi.Dtos
{
    public class InvoiceDto
    {
        public int Fk_id_payment_method { get; set; }
        public List<Cart>? carts { get; set; }
    }
}
