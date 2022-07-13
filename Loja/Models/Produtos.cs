using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Loja.Models
{
    public class Produtos
    {
        [Key]
        public int Id_Produto { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public string? Categoria { get; set; }
        public int Preco { get; set; }
        public byte[]? Imagem { get; set; }
        [NotMapped]
        public IFormFile? ImagemDados { get; set; }
        public string? Marca { get; set; }
        public string? Tipo { get; set; }
    }

}
