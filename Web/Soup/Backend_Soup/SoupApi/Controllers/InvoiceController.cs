using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoupApi.Dtos;
using SoupApi.Repositories;
using System.Security.Claims;

namespace SoupApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly InvoiceRepository _invoiceRepository;
        public InvoiceController(InvoiceRepository invoiceRepository)
        {
            _invoiceRepository = invoiceRepository;
        }

        [Authorize]
        [HttpPost("Create")]
        public IActionResult Create([FromBody] InvoiceDto invoiceDto)
        {
            try
            {
                int userId = int.Parse(User.FindFirstValue(ClaimTypes.Sid));
                string errorMessage = _invoiceRepository.Create(invoiceDto.Fk_id_payment_method, userId, invoiceDto.carts);

                // kalau ada isi nya
                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                //kalau tidak maka oke
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize]
        [HttpPost("BuyNow")]
        public IActionResult BuyNow([FromBody] InvoiceDtoBuyNow invoiceDto)
        {
            try
            {
                int userId = int.Parse(User.FindFirstValue(ClaimTypes.Sid));
                string errorMessage = _invoiceRepository.BuyNow(invoiceDto.Fk_id_payment_method, userId, invoiceDto.Fk_id_product, invoiceDto.Schedule);

                // kalau ada isi nya
                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                //kalau tidak maka oke
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize]
        [HttpGet("GetInvoiceMenuByUserId")]
        public IActionResult GetInvoiceMenuByUserId()
        {
            try
            {
                int userId = int.Parse(User.FindFirstValue(ClaimTypes.Sid));
                var invoices = _invoiceRepository.GetInvoiceMenuByUserId(userId);
                return Ok(invoices);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpGet("GetInvoiceMenuAllAdmin")]
        public IActionResult GetInvoiceMenuAllAdmin()
        {
            try
            {
                var invoices = _invoiceRepository.GetInvoiceMenuAllAdmin();
                return Ok(invoices);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize]
        [HttpGet("GetPaidProductsByUserId")]
        public IActionResult GetPaidProductsByUserId()
        {
            try
            {
                int userId = int.Parse(User.FindFirstValue(ClaimTypes.Sid));
                var invoices = _invoiceRepository.GetPaidProduct(userId);
                return Ok(invoices);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize]
        [HttpGet("GetInvoiceDetailsByInvoiceId/{id}")]
        public IActionResult GetInvoiceDetailsByInvoiceId(int id)
        {
            try
            {
                var invoices = _invoiceRepository.GetInvoiceDetailsByInvoiceId(id);
                return Ok(invoices);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }
    }
}
