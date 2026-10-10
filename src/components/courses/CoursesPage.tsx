import React from 'react';
import { 
  GraduationCap, 
  Clock, 
  Users, 
  Calendar, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  Phone,
  MessageCircle
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const CoursesPage: React.FC = () => {
  const { courses, openEnquiryModal, settings } = useSalon();

  return (
    <div className="py-12 bg-[#FFFDF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8E0FF] text-[#483449] text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-[#F07878]" />
            <span>Glam Set Go Beauty & Makeover Academy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#483449]">
            Professional Makeup & Cosmetology Courses
          </h1>

          <p className="text-sm sm:text-base text-[#766A77]">
            Practical hands-on training mentored personally by lead makeover artist Chetana Patel in Naroda, Ahmedabad. Learn modern bridal techniques, salon chemistry, nail artistry, and build an authentic portfolio.
          </p>
        </div>

        {/* Why Learn With Us Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          <div className="p-5 rounded-2xl bg-white border border-[#F0E8EE] space-y-1.5">
            <h3 className="text-sm font-semibold text-[#483449] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#F07878]" />
              <span>Small Intimate Batches (4-6 Seats)</span>
            </h3>
            <p className="text-xs text-[#766A77]">
              Every student receives individual brush-holding corrections, personalized feedback, and 1-on-1 mentorship.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F0E8EE] space-y-1.5">
            <h3 className="text-sm font-semibold text-[#483449] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Real Salon Floor Exposure</span>
            </h3>
            <p className="text-xs text-[#766A77]">
              Practice on live mannequins and real studio clients during Gujarati wedding peak seasons.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F0E8EE] space-y-1.5">
            <h3 className="text-sm font-semibold text-[#483449] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Vanity Kit & Portfolio Guidance</span>
            </h3>
            <p className="text-xs text-[#766A77]">
              Learn professional product selection without wasting budget on unnecessary items. Includes photo shoots of your work.
            </p>
          </div>
        </div>

        {/* Courses Cards */}
        <div className="space-y-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-[#F0E8EE] p-6 sm:p-8 shadow-2xs hover:shadow-md transition-all flex flex-col lg:flex-row gap-8 items-start justify-between"
            >
              <div className="space-y-4 max-w-3xl flex-1">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-semibold px-3 py-1 rounded-full bg-[#F8DCE5] text-[#483449]">
                    {course.duration}
                  </span>
                  <span className="text-[#766A77]">
                    Format: {course.format}
                  </span>
                  <span className="text-emerald-700 font-medium">
                    Batch Date: {course.nextBatchDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#483449]">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#766A77] mt-1 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Topics Covered */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#483449] block">
                    Key Curriculum Modules:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#766A77]">
                    {course.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#F07878] shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-xs text-[#766A77]">
                  <strong className="text-[#483449]">Eligibility:</strong> {course.eligibility} · <strong>Seats per batch:</strong> {course.seatsPerBatch} seats only.
                </div>
              </div>

              {/* Fee & Action Card */}
              <div className="w-full lg:w-72 p-6 rounded-2xl bg-[#FFFDF9] border border-[#F0E8EE] text-center space-y-4 shrink-0">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#766A77] font-semibold block">
                    Tuition Investment
                  </span>
                  <span className="text-3xl font-serif font-bold text-[#483449]">
                    ₹{course.fee.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#766A77] block mt-0.5">
                    Flexible installment plan available
                  </span>
                </div>

                <button
                  onClick={() => openEnquiryModal(course)}
                  className="w-full py-3 px-4 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  Enquire for Admission
                </button>

                <a
                  href={`https://wa.me/${settings.whatsAppNumber}?text=${encodeURIComponent(`Hello Chetana! I am enquiring about admissions for ${course.title}. Please provide batch timings.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#F0E8EE] text-xs font-medium text-emerald-800 hover:bg-[#DDF3E7]/40 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Course Desk</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
