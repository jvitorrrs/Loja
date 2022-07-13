using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Loja.Data;
using Loja.Models;

namespace Loja.Controllers
{
    public class ProdutosController : Controller
    {
        private readonly LojaContext _context;

        public ProdutosController(LojaContext context)
        {
            _context = context;
        }

        // GET: Produtos
        public async Task <IActionResult> Index(string? nome, string? nomePesquisa)
        {
            var produtos = await _context.Produtos!.ToListAsync();
            
            if(nome!=null){
            var produtosFiltrados = produtos.Where(p => p.Tipo!.Contains(nome!));
                var list = produtosFiltrados.GroupBy(p => p.Preco);
                List<int> listaPrecos = new();
                foreach(var item in list)
                {
                    listaPrecos.Add(item.Key);
                }
                ViewBag.Lista = listaPrecos;
                return View(produtosFiltrados);
            }

            if (nomePesquisa != null)
            {
                var produtosFiltrados = produtos.Where(p => p.Nome!.Contains(nomePesquisa!));
                var list = produtosFiltrados.GroupBy(p => p.Preco);
                List<int> listaPrecos = new();
                foreach (var item in list)
                {
                    listaPrecos.Add(item.Key);
                }
                ViewBag.Lista = listaPrecos;
                return View(produtosFiltrados);
            }

            var a = produtos.GroupBy(p => p.Preco);
            List<int> lista = new();
            foreach(var item in a)
            {
                lista.Add(item.Key);
            }

            if (ViewBag.Lista == null)
            {
                ViewBag.Lista = lista;
            }

            return _context.Produtos != null ?
                View(await _context.Produtos.ToListAsync()) :
                Problem("Not Found");
        }

        public async Task<IActionResult> Filter()
         {
            if (_context.Produtos != null)
            {
                var elements = await _context.Produtos!.ToListAsync();
                return Json(elements);
            }
            return NotFound();
        }


        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Produtos == null)
            {
                return NotFound();
            }

            var produtos = await _context.Produtos
                .FirstOrDefaultAsync(m => m.Id_Produto == id);
            if (produtos == null)
            {
                return NotFound();
            }

            return View(produtos);
        }

        // GET: Produtos/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Produtos/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create([Bind("Id_Produto,Nome,Descricao,Categoria,Preco,ImagemDados")] Produtos produtos)
        {
            if (ModelState.IsValid)
            {
                if (produtos.ImagemDados != null)
                {
                    using var ms = new MemoryStream();

                    produtos.ImagemDados.CopyTo(ms);
                    produtos.Imagem = ms.ToArray();

                }
                _context.Add(produtos);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(produtos);
        }


        // GET: Produtos/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Produtos == null)
            {
                return NotFound();
            }

            var produtos = await _context.Produtos.FindAsync(id);
            if (produtos == null)
            {
                return NotFound();
            }
            return View(produtos);
        }


        // POST: Produtos/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id_Produto,Nome,Descricao,Categoria,Preco,Imagem")] Produtos produtos)
        {
            if (id != produtos.Id_Produto)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(produtos);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProdutosExists(produtos.Id_Produto))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(produtos);
        }

        // GET: Produtos/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Produtos == null)
            {
                return NotFound();
            }

            var produtos = await _context.Produtos
                .FirstOrDefaultAsync(m => m.Id_Produto == id);
            if (produtos == null)
            {
                return NotFound();
            }

            return View(produtos);
        }

        // POST: Produtos/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Produtos == null)
            {
                return Problem("Entity set 'LojaContext.Produtos'  is null.");
            }
            var produtos = await _context.Produtos.FindAsync(id);
            if (produtos != null)
            {
                _context.Produtos.Remove(produtos);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ProdutosExists(int id)
        {
            return (_context.Produtos?.Any(e => e.Id_Produto == id)).GetValueOrDefault();
        }
    }
}
