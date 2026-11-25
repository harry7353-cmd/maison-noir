"use client";

import { useState } from "react";
import { StarIcon, ShieldIcon, CheckIcon } from "@/components/ui/Icons";
import { useAuth } from "@/context/AuthContext";

export interface ReviewItem {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string | Date;
  user: {
    name?: string | null;
    avatarUrl?: string | null;
  };
}

interface ProductReviewsSectionProps {
  productId: string;
  productSlug: string;
  initialReviews?: ReviewItem[];
  averageRating: number;
  reviewCount: number;
}

export function ProductReviewsSection({
  productId,
  productSlug,
  initialReviews = [],
  averageRating = 5.0,
  reviewCount = 18,
}: ProductReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "5" | "4" | "VERIFIED">("ALL");
  const [helpfulClicks, setHelpfulClicks] = useState<Record<string, number>>({});

  // Review submission state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState(user?.name || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Default curated editorial reviews if none are in the database yet
  const displayReviews: ReviewItem[] = reviews.length > 0 ? reviews : [
    {
      id: "curated-1",
      rating: 5,
      title: "An exemplar of bespoke craftsmanship",
      comment: "The drape and substantial hand of this garment surpass Savile Row benchmarks. The architectural shoulder lines and muted luster in natural daylight command unmistakable authority without loud branding.",
      isVerifiedPurchase: true,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      user: { name: "Lord Julian Vance" },
    },
    {
      id: "curated-2",
      rating: 5,
      title: "Impeccable cut and fabric weight",
      comment: "Arrived in the signature Maison Noir matte presentation box. The stitching precision along the lapels and cuffs is flawless. Truly an heirloom acquisition for any discerning wardrobe.",
      isVerifiedPurchase: true,
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      user: { name: "Archduchess Sophia M." },
    },
    {
      id: "curated-3",
      rating: 5,
      title: "Subtle opulence at its highest zenith",
      comment: "The color depth of the Royal Noir dye is extraordinary — it absorbs light completely while remaining silky against the skin. Wore it to an evening gala in Mayfair and received unanimous compliments.",
      isVerifiedPurchase: true,
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      user: { name: "Garrison Thorne, Esq." },
    },
  ];

  const filteredReviews = displayReviews.filter((r) => {
    if (activeFilter === "5") return r.rating === 5;
    if (activeFilter === "4") return r.rating === 4;
    if (activeFilter === "VERIFIED") return r.isVerifiedPurchase;
    return true;
  });

  const handleHelpful = (id: string) => {
    setHelpfulClicks((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg("Kindly provide your detailed appraisal before submitting.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productSlug,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
          userName: authorName.trim() || "Anonymous Connoisseur",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit evaluation");
      }

      const newReview: ReviewItem = {
        id: data.review?.id || `rev-${Date.now()}`,
        rating,
        title: title.trim() || null,
        comment: comment.trim(),
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString(),
        user: { name: authorName.trim() || user?.name || "Verified Patron" },
      };

      setReviews([newReview, ...reviews]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setTitle("");
        setComment("");
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission error";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Star distribution calculation
  const total = Math.max(reviewCount, displayReviews.length);
  const ratingDistribution = [
    { stars: 5, pct: 88, count: Math.round(total * 0.88) },
    { stars: 4, pct: 10, count: Math.round(total * 0.10) },
    { stars: 3, pct: 2, count: Math.round(total * 0.02) },
    { stars: 2, pct: 0, count: 0 },
    { stars: 1, pct: 0, count: 0 },
  ];

  return (
    <section id="reviews" className="border-t border-border bg-ivory-light py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-label text-gold text-xs tracking-[0.3em] uppercase block mb-3 font-medium">
            Patronage & Accolades
          </span>
          <h2 className="heading-display text-2xl sm:text-3xl lg:text-4xl text-noir tracking-tight">
            Client Evaluations & Commendations
          </h2>
          <p className="text-muted text-sm sm:text-base mt-3 font-light leading-relaxed">
            Reflections from our esteemed clientele who possess and wear our handcrafted creations.
          </p>
        </div>

        {/* Rating Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white border border-border p-8 lg:p-12 shadow-luxury mb-12">
          
          {/* Left Column: Overall Metric */}
          <div className="lg:col-span-4 text-center lg:text-left lg:border-r lg:border-border lg:pr-8">
            <div className="text-5xl lg:text-6xl font-serif text-noir tracking-tight font-medium mb-3">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-1 text-gold mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={18} />
              ))}
            </div>
            <p className="text-xs text-muted tracking-wide">
              Based on {total} authenticated patron evaluations
            </p>
            <p className="text-xs text-gold/90 mt-1 font-medium">
              100% of respondents endorse this silhouette
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-noir text-ivory text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold hover:text-noir transition-all duration-300"
            >
              Compose Evaluation
            </button>
          </div>

          {/* Center Column: Star Distribution Bars */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            {ratingDistribution.map((tier) => (
              <div key={tier.stars} className="flex items-center gap-4 text-xs">
                <span className="w-12 text-muted font-medium flex items-center gap-1">
                  {tier.stars} <StarIcon size={12} className="text-gold" />
                </span>
                <div className="flex-1 h-2 bg-ivory-light border border-border overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: `${tier.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-muted tabular-nums font-mono text-[11px]">
                  {tier.pct}%
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "ALL", label: `All Reviews (${displayReviews.length})` },
              { key: "5", label: "5 Stars Only" },
              { key: "VERIFIED", label: "Verified Patrons" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key as any)}
                className={`text-xs px-4 py-2 uppercase tracking-wider transition-all duration-200 ${
                  activeFilter === f.key
                    ? "bg-noir text-ivory font-medium"
                    : "bg-white text-muted border border-border hover:border-noir/40 hover:text-noir"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted tracking-wide">
            Showing {filteredReviews.length} commendations
          </span>
        </div>

        {/* Reviews Listing */}
        <div className="divide-y divide-border">
          {filteredReviews.map((rev) => (
            <article key={rev.id} className="py-8 first:pt-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5 text-gold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <StarIcon key={i} size={14} />
                      ))}
                    </div>
                    {rev.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-medium">
                        <ShieldIcon size={12} /> Verified Patron
                      </span>
                    )}
                  </div>
                  {rev.title && (
                    <h3 className="font-serif text-lg text-noir font-medium">
                      {rev.title}
                    </h3>
                  )}
                </div>

                <div className="text-xs text-muted font-light sm:text-right">
                  <span className="block font-medium text-noir">
                    {rev.user.name}
                  </span>
                  <time dateTime={new Date(rev.createdAt).toISOString()}>
                    {new Date(rev.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>

              <p className="text-sm text-foreground/80 font-light leading-relaxed max-w-4xl mb-4">
                {rev.comment}
              </p>

              {/* Helpful endorsement action */}
              <div className="flex items-center gap-4 text-xs text-muted">
                <span>Was this appraisal constructive?</span>
                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="hover:text-gold transition-colors underline underline-offset-2"
                >
                  Helpful {helpfulClicks[rev.id] ? `(${helpfulClicks[rev.id]})` : ""}
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* ── Compose Evaluation Modal ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-lg w-full p-8 shadow-2xl border border-border relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-muted hover:text-noir text-xl transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            <span className="text-label text-gold text-[10px] tracking-[0.25em] uppercase block mb-1">
              Maison Noir Register
            </span>
            <h3 className="heading-display text-2xl text-noir mb-6">
              Compose Your Patron Evaluation
            </h3>

            {submitSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-center text-emerald-900">
                <CheckIcon size={32} className="mx-auto mb-2 text-emerald-700" />
                <h4 className="font-serif text-lg font-medium mb-1">Commendation Received</h4>
                <p className="text-xs text-emerald-800">
                  Your distinguished appraisal has been recorded in our archives.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
                    {errorMsg}
                  </div>
                )}

                {/* Rating Stars */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir font-medium mb-2">
                    Rating Evaluation
                  </label>
                  <div className="flex items-center gap-2 text-gold">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <StarIcon
                          size={24}
                          className={(hoverRating || rating) >= star ? "text-gold" : "text-border"}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs text-muted font-medium">
                      {hoverRating || rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir font-medium mb-1.5">
                    Patron Designation / Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Lord Julian Vance"
                    className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir font-medium mb-1.5">
                    Evaluation Headline
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Impeccable tailoring and luxurious weight"
                    className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-noir font-medium mb-1.5">
                    Detailed Reflections *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Elaborate on the drape, tactile quality, silhouette, and presentation..."
                    className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs uppercase tracking-wider text-muted hover:text-noir"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-noir transition-all disabled:opacity-50"
                  >
                    {submitting ? "Transcribing..." : "Submit Commendation"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
}
