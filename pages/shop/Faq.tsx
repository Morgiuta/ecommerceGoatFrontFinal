
import React, { useState, useEffect } from 'react';
import {HelpCircle,ChevronDown, } from 'lucide-react';
import { Link } from "react-router-dom";



const Faq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  return (
    <section id="faq" className="bg-slate-50 rounded-[3rem] p-8 md:p-16 space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            <HelpCircle size={14} />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800">Preguntas Frecuentes</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Resolvemos tus dudas más comunes para que tu experiencia de compra sea perfecta.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: "¿Cuáles son los métodos de pago?", a: "Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, Amex), Mercado Pago, PayPal y transferencias bancarias. Ofrecemos hasta 12 cuotas sin interés en productos seleccionados." },
            { q: "¿Cuánto tarda en llegar mi pedido?", a: "Los envíos en CABA y GBA se entregan en 24hs hábiles. Para el resto del país, el tiempo estimado es de 2 a 5 días hábiles dependiendo de la localidad." },
            { q: "¿Los productos tienen garantía?", a: "Sí, todos nuestros productos son nuevos, originales y cuentan con garantía oficial del fabricante por un mínimo de 6 meses hasta 1 año." },
            { q: "¿Puedo realizar un cambio o devolución?", a: "Tenés 30 días para realizar cambios o devoluciones siempre que el producto esté en su embalaje original y sin uso. El proceso es totalmente gratuito." },
            { q: "¿Hacen envíos a todo el país?", a: "Sí, llegamos a cada rincón de la Argentina a través de nuestra red logística propia y convenios con los principales correos del país." }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-700">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>)
};

export default Faq;
