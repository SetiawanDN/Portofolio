namespace SoupApi.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public int Fk_id_user { get; set; }
        public int Fk_id_payment_method { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime Updated_at { get; set; }
        public bool IsActivated { get; set; }
    }
}
