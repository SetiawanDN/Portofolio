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
    public class ProductController : ControllerBase
    {
        private readonly ProductRepository _productRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ProductController(ProductRepository productRepository, IWebHostEnvironment webHostEnvironment)
        {
            _productRepository = productRepository;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            try
            {
                var products = _productRepository.GetAll();
                return Ok(products);
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
                var products = _productRepository.GetAllAdmin();
                return Ok(products);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [HttpGet("GetLimitRandom")]
        public IActionResult GetLimitRandom()
        {
            try
            {
                var products = _productRepository.GetLimit6Random();
                return Ok(products);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [HttpGet("GetByCategoryId/{category_id}")]
        public IActionResult GetByCategoryId(int category_id)
        {
            try
            {
                var products = _productRepository.GetByCategoryId(category_id);
                return Ok(products);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpGet("GetByCategoryIdAdmin/{category_id}")]
        public IActionResult GetByCategoryIdAdmin(int category_id)
        {
            try
            {
                var products = _productRepository.GetByCategoryIdAdmin(category_id);
                return Ok(products);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("Create")]
        public async Task<ActionResult> CreateProduct([FromForm] ProductDto productDto)
        {
            try
            {
                IFormFile image = productDto.Image!;

                // TODO: save image to server
                var ext = Path.GetExtension(image.FileName).ToLowerInvariant(); //.jpg

                //get filename
                string fileName = Guid.NewGuid().ToString() + ext; //pasti unik
                string uploadDir = "uploads"; //foldering biar rapih
                string physicalPath = $"wwwroot/{uploadDir}";
                //saving image
                var filePath = Path.Combine(_webHostEnvironment.ContentRootPath, physicalPath, fileName); // /wwwroot/uploads/asdasd.png
                using var stream = System.IO.File.Create(filePath);
                await image.CopyToAsync(stream);

                //create url path
                string fileUrlPath = $"{uploadDir}/{fileName}";

                string errorMessage = _productRepository.Create(new Product
                {
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    Fk_id_category = productDto.fk_id_category,
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
        public async Task<ActionResult> UpdateProduct(int id, [FromForm] ProductDto productDto)
        {
            try
            {
                string img = string.Empty;
                if (productDto.Image != null)
                {
                    IFormFile image = productDto.Image!;

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
                    img = _productRepository.GetImage(id);
                }


                string errorMessage = _productRepository.Update(new Product
                {
                    Id = id,
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    Image = img,
                    Fk_id_category = productDto.fk_id_category,
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
                string errorMessage = _productRepository.UpdateIsActivated(new Product
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
