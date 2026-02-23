

import React, { useState, useEffect } from 'react';
import {Shield,Truck,HeadphonesIcon,Zap } from 'lucide-react';
import { Link } from "react-router-dom";



const AboutUs: React.FC = () => {

  return (
    <section className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Sobre Nosotros</span>
          <h2 className="text-3xl font-black text-slate-800 leading-tight">
            Más de 10 años llevando tecnología a tu vida
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Somos una empresa apasionada por la tecnología. Desde 2014, conectamos a miles de clientes con los mejores productos del mercado, ofreciendo una experiencia de compra simple, segura y confiable. Nuestro equipo trabaja cada día para que tengas acceso a lo último en innovación con el mejor servicio postventa.
          </p>
          <div className="flex gap-8 pt-2">
            <div>
              <p className="text-3xl font-black text-indigo-600">+50k</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Clientes felices</p>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-600">+1200</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Productos</p>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-600">10+</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Años de experiencia</p>
            </div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 rounded-2xl p-5 space-y-2">
            <Shield className="text-indigo-600" size={28} />
            <p className="font-bold text-slate-700">Compra Segura</p>
            <p className="text-xs text-slate-400">Tus datos y pagos siempre protegidos.</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-5 space-y-2">
            <Truck className="text-amber-500" size={28} />
            <p className="font-bold text-slate-700">Envío Rápido</p>
            <p className="text-xs text-slate-400">Entrega en 24-48hs a todo el país.</p>
          </div>
          <div className="bg-rose-50 rounded-2xl p-5 space-y-2">
            <HeadphonesIcon className="text-rose-500" size={28} />
            <p className="font-bold text-slate-700">Soporte 24/7</p>
            <p className="text-xs text-slate-400">Estamos siempre disponibles para ayudarte.</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-5 space-y-2">
            <Zap className="text-emerald-500" size={28} />
            <p className="font-bold text-slate-700">Garantía Oficial</p>
            <p className="text-xs text-slate-400">Todos nuestros productos con garantía de fábrica.</p>
          </div>
        </div>
      </section>)
};

export default AboutUs;


