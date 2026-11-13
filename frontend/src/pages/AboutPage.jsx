import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Droplet, Heart, Sparkles, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-botanical-700 bg-botanical-100 px-3.5 py-1 rounded-full border border-botanical-200">
          Our Formulation Ethos
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-botanical-900 leading-tight">
          Where Ancient Botanical Wisdom Meets Modern Clean Science.
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
          Founded on a fundamental belief: pure botanical extracts nourish human skin with effortless harmony. 
          We formulate without synthetic shortcuts, fillers, or artificial preservatives.
        </p>
      </div>

      {/* Origin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-wider font-bold text-terracotta-600">
            The Philosophy of Living Ingredients
          </span>
          <h2 className="font-serif text-3xl font-semibold text-botanical-900 leading-snug">
            Formulations That Respect Human Biology.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Conventional cosmetic formulations frequently rely on 80% water and petro-chemical emulsifiers. 
            At Naturalis, every drop is an active participant: virgin cold-pressed carrier oils, steam-distilled 
            plant waters, and wild-harvested adaptogens.
          </p>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            We partner directly with family farms and indigenous foraging cooperatives who harvest according to 
            botanical cycles, ensuring high concentrations of therapeutic flavonoids and antioxidants.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-earth-100/70 p-4 rounded-2xl border border-earth-200">
              <span className="font-serif text-2xl font-bold text-botanical-900 block">100%</span>
              <span className="text-xs text-stone-600">Pure Botanical Origins</span>
            </div>
            <div className="bg-earth-100/70 p-4 rounded-2xl border border-earth-200">
              <span className="font-serif text-2xl font-bold text-botanical-900 block">0%</span>
              <span className="text-xs text-stone-600">Synthetic Perfumes or Dyes</span>
            </div>
          </div>
        </div>

        {/* Visual Photorealistic AI Representation */}
        <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-earth-200 shadow-card border-4 border-white relative group">
          <img
            src="/images/heritage/extraction.jpg"
            alt="Ayurvedic Micro-Batch Cold Extraction in Kerala Workshop"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          {/* Subtle gradient vignette with narrative caption */}
          <div className="absolute inset-0 bg-gradient-to-t from-botanical-950/80 via-botanical-950/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-cream-light">
            <span className="text-[10px] uppercase font-bold tracking-widest text-botanical-300">
              Authentic Apothecary Process
            </span>
            <h3 className="font-serif text-xl font-bold text-white mt-1">
              Micro-Batch Cold Extraction
            </h3>
            <p className="text-xs text-cream-dark/90 max-w-md mt-1 leading-relaxed">
              Traditional Chekku wood-pressing and slow Kshirapaka simmering in Kerala workshops. Sealed in UV-protective amber glass to preserve living bio-actives.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="bg-earth-100/50 rounded-3xl p-8 sm:p-12 border border-earth-200 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-botanical-700">
            Guiding Principles
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-botanical-900">
            Our Four Non-Negotiable Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-earth-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-botanical-900">Wild-Harvested</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Plants gathered from their native soil carry resilient phytochemical profiles unmatched by intensive commercial farming.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-earth-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-botanical-900">Cold-Pressed Only</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Never subjected to extreme thermal processing or chemical solvents like hexane, preserving volatile fatty acids.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-earth-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-botanical-900">Plastic Negative</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              For every gram of packaging we dispatch, we recover two grams of ocean-bound plastic in partnership with clean-up initiatives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-earth-200/80 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-botanical-900">Batch Traceability</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every bottle carries an apothecary batch identifier tracking date of pressing, region of origin, and purity test report.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center py-10 space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-botanical-900">
          Ready to experience the pure difference?
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Explore our certified organic collection, backed by our 30-day freshness guarantee.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-botanical-700 hover:bg-botanical-800 text-white px-7 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-card"
        >
          <span>Shop the Living Harvest</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
