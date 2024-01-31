using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoupApi.Dtos;
using SoupApi.Models;
using SoupApi.Repositories;

namespace SoupApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMethodController : ControllerBase
    {
        private readonly PaymentMethodRepository _paymentMethodRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public PaymentMethodController(PaymentMethodRepository paymentMethodRepository, IWebHostEnvironment webHostEnvironment)
        {
            _paymentMethodRepository = paymentMethodRepository;
            _webHostEnvironment = webHostEnvironment;

        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            try
            {
                var categories = _paymentMethodRepository.GetAll();
                return Ok(categories);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpGet("GetAllAdmin")]
        public IActionResult GetAllAdmin()
        {
            try
            {
                var categories = _paymentMethodRepository.GetAllAdmin();
                return Ok(categories);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("Create")]
        public async Task<ActionResult> CreateCategory([FromForm] PaymentMethodDto paymentMethodDto)
        {
            try
            {
                IFormFile image = paymentMethodDto.Image!;

                // TODO: save image to server
                var ext = Path.GetExtension(image.FileName).ToLowerInvariant(); //.jpg

                //get filename
                string fileName = Guid.NewGuid().ToString() + ext; //pasti unik
                string uploadDir = "uploads"; //foldering biar rapih
                string physicalPath = $"wwwroot/{uploadDir}";
                //saving image
                var filePath = Path.Combine(_webHostEnvironment.ContentRootPath, physicalPath, fileName);
                using var stream = System.IO.File.Create(filePath);
                await image.CopyToAsync(stream);

                //create url path
                string fileUrlPath = $"{uploadDir}/{fileName}";

                string errorMessage = _paymentMethodRepository.Create(new PaymentMethod
                {
                    Name = paymentMethodDto.Name,
                    Image = fileUrlPath,
                });

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("Update/{id}")]
        public async Task<ActionResult> UpdateCategory(int id, [FromForm] PaymentMethodDto paymentMethodDto)
        {
            try
            {
                string img = string.Empty;
                if (paymentMethodDto.Image != null)
                {
                    IFormFile image = paymentMethodDto.Image!;

                    // TODO: save image to server
                    var ext = Path.GetExtension(image.FileName).ToLowerInvariant(); //.jpg

                    //get filename
                    string fileName = Guid.NewGuid().ToString() + ext; //pasti unik
                    string uploadDir = "uploads"; //foldering biar rapih
                    string physicalPath = $"wwwroot/{uploadDir}";
                    //saving image
                    var filePath = Path.Combine(_webHostEnvironment.ContentRootPath, physicalPath, fileName); // D:projects/shopi/wwwroot/uploads/asdasd.png
                    using var stream = System.IO.File.Create(filePath);
                    await image.CopyToAsync(stream);

                    //create url path
                    string fileUrlPath = $"{uploadDir}/{fileName}";
                    img = fileUrlPath;
                }
                else
                {
                    img = _paymentMethodRepository.GetImage(id);
                }

                string errorMessage = _paymentMethodRepository.Update(new PaymentMethod
                {
                    Id = id,
                    Name = paymentMethodDto.Name,
                    Image = img,
                });

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("UpdateIsActivated/{id}")]
        public IActionResult UpdateCategoryIsActivated(int id, [FromBody] UpdateIsActivatedDto updateIsActivatedDto)
        {
            try
            {
                string errorMessage = _paymentMethodRepository.UpdateIsActivated(new PaymentMethod
                {
                    Id = id,
                    IsActivated = updateIsActivatedDto.IsActivated,
                });

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }
    }
}
