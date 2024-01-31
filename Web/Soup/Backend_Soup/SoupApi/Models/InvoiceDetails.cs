namespace SoupApi.Models
{
    public class InvoiceDetails
    {
        public int Id { get; set; }
        public int Fk_id_invoice { get; set; }
        public int Fk_id_product { get; set; }
        public int cost_per_product { get; set; }
        public DateTime Schedule { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime Updated_at { get; set; }
        public bool IsActivated { get; set; }
    }
}
