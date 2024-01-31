using SoupApi.Models;

namespace SoupApi.Dtos
{
    public class InvoiceDtoBuyNow
    {
        public int Fk_id_payment_method { get; set; }
        public int Fk_id_product { get; set; }
        public DateTime Schedule { get; set; }
    }
}
