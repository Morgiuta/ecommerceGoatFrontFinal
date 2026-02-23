import React, { useState, useEffect } from "react";
import { Shield, Zap, Truck, HeadphonesIcon } from "lucide-react";
import { Link } from "react-router-dom";

const WhyUs: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
          ¿Por qué elegirnos?
        </span>
        <h2 className="text-3xl font-black text-slate-800">
          Características que nos destacan
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Cada producto en nuestro catálogo pasa por un riguroso proceso de
          selección para garantizarte la mejor calidad.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <Shield size={32} className="text-indigo-600" />,
            title: "Calidad Premium",
            desc: "Solo trabajamos con marcas líderes y productos certificados internacionalmente.",
            bg: "bg-indigo-50",
          },
          {
            icon: <Zap size={32} className="text-amber-500" />,
            title: "Última Tecnología",
            desc: "Siempre actualizamos nuestro catálogo con los lanzamientos más recientes del mercado.",
            bg: "bg-amber-50",
          },
          {
            icon: <Truck size={32} className="text-emerald-500" />,
            title: "Logística Eficiente",
            desc: "Red de distribución propia para garantizar entregas rápidas y en perfectas condiciones.",
            bg: "bg-emerald-50",
          },
          {
            icon: <HeadphonesIcon size={32} className="text-rose-500" />,
            title: "Postventa Dedicada",
            desc: "Acompañamos tu compra con soporte técnico especializado y atención personalizada.",
            bg: "bg-rose-50",
          },
        ].map((feat, i) => (
          <div
            key={i}
            className={`${feat.bg} rounded-3xl p-7 space-y-4 hover:shadow-lg transition-shadow`}
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              {feat.icon}
            </div>
            <h3 className="font-black text-slate-800 text-lg">{feat.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyUs;
