namespace SoupApi.Dtos
{
    public class PaymentMethodDto
    {
        public string Name { get; set; } = string.Empty;
        public IFormFile? Image { get; set; }
    }
}
