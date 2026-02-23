
import React, { useState, useEffect } from 'react';
import {Quote,Star, } from 'lucide-react';
import { Link } from "react-router-dom";



const Testimonials: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  return (
    <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Testimonios</span>
          <h2 className="text-3xl font-black text-slate-800">Lo que dicen nuestros clientes</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Miles de personas ya confían en nosotros. Estas son algunas de sus experiencias.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Valentina R.',
              role: 'Diseñadora Gráfica',
              avatar: 'VR',
              rating: 5,
              comment: 'Compré una notebook y llegó en perfectas condiciones al día siguiente. El proceso fue súper simple y el soporte me ayudó con todas mis dudas. ¡100% recomendable!',
              color: 'bg-indigo-600',
            },
            {
              name: 'Matías G.',
              role: 'Emprendedor',
              avatar: 'MG',
              rating: 5,
              comment: 'Excelente relación calidad-precio. Los productos son originales y la garantía es real. Ya llevo 3 compras y siempre la misma experiencia impecable.',
              color: 'bg-rose-500',
            },
            {
              name: 'Lucía F.',
              role: 'Estudiante Universitaria',
              avatar: 'LF',
              rating: 4,
              comment: 'Me sorprendió la velocidad del envío y el embalaje. El producto llegó exactamente como en las fotos. Sin dudas volvería a comprar acá.',
              color: 'bg-emerald-500',
            },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 p-7 space-y-5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
              <Quote size={28} className="text-indigo-200" />
              <p className="text-slate-600 leading-relaxed text-sm">"{t.comment}"</p>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
                {Array.from({ length: 5 - t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-slate-200" fill="currentColor" />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-black`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>)
};

export default Testimonials;
