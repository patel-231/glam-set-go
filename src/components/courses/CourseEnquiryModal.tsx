import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  User, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const CourseEnquiryModal: React.FC = () => {
  const { 
    isEnquiryModalOpen, 
    closeEnquiryModal, 
    selectedCourseForEnquiry, 
    courses, 
    submitCourseEnquiry,
    settings 
  } = useSalon();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    selectedCourseForEnquiry ? selectedCourseForEnquiry.id : courses[0]?.id || ''
  );
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [priorExperience, setPriorExperience] = useState('Beginner / Zero Experience');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isEnquiryModalOpen) return null;

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || selectedCourseForEnquiry;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) {
      alert('Please provide your name and phone number.');
      return;
    }

    submitCourseEnquiry({
      courseId: currentCourse ? currentCourse.id : 'general',
      courseTitle: currentCourse ? currentCourse.title : 'General Academy Enquiry',
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      studentEmail: studentEmail.trim() || undefined,
      priorExperience,
      message: message.trim() || undefined,
    });

    setIsSubmitted(true);
  };

  const getWhatsAppEnquiryUrl = () => {
    const courseTitle = currentCourse ? currentCourse.title : 'Glam Set Go Beauty Courses';
    const msg = `Hello Chetana & Glam Set Go Academy! 🎓\nI am interested in enrolling for the *${courseTitle}* in Naroda.\n\n*Name:* ${studentName || 'Prospective Student'}\n*Phone:* ${studentPhone}\n*Background:* ${priorExperience}\n\nPlease share the syllabus and upcoming batch availability. Thank you!`;
    return `https://wa.me/${settings.whatsAppNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#F0E8EE] shadow-2xl overflow-hidden my-auto animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#FFFDF9] border-b border-[#F0E8EE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8E0FF] text-[#483449] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#F07878]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F07878] block">
                Glam Set Go Academy
              </span>
              <h3 className="text-lg font-serif font-bold text-[#483449]">
                Course Admission Enquiry
              </h3>
            </div>
          </div>

          <button
            onClick={closeEnquiryModal}
            className="p-2 rounded-full text-[#766A77] hover:text-[#483449] hover:bg-[#F8DCE5]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-[#DDF3E7] text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-serif font-bold text-[#483449]">
                  Enquiry Received!
                </h4>
                <p className="text-xs text-[#766A77] max-w-sm mx-auto">
                  Thank you, {studentName}. Chetana Patel and our academy counseling desk will contact you at <strong>{studentPhone}</strong> to guide you through batch timings and syllabus.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={getWhatsAppEnquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Immediate WhatsApp to Academy Desk</span>
                </a>

                <button
                  onClick={closeEnquiryModal}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#766A77] hover:text-[#483449]"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Course Selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Select Course *
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#F0E8EE] bg-[#FFFDF9] text-xs font-medium text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.duration} · ₹{c.fee.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#766A77]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Soni"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F0E8EE] text-xs text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#766A77]" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9825123456"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F0E8EE] text-xs text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                  />
                </div>
              </div>

              {/* Prior Experience */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Prior Beauty / Makeup Background
                </label>
                <select
                  value={priorExperience}
                  onChange={(e) => setPriorExperience(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-[#F0E8EE] bg-white text-xs text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                >
                  <option value="Beginner / Zero Experience">Beginner (Starting from scratch)</option>
                  <option value="Basic Self-Taught">Self-Taught / Enthusiast</option>
                  <option value="Practicing Assistant">Practicing Salon Assistant</option>
                  <option value="Freelance Artist Upgrading">Freelance Artist looking to upgrade skills</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#483449] block">
                  Questions or Preferred Batch Timings (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Interested in morning weekend batch, need details on student kit."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F0E8EE] text-xs text-[#483449] focus:outline-none focus:ring-2 focus:ring-[#F8DCE5]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={closeEnquiryModal}
                  className="px-4 py-2.5 text-xs text-[#766A77] hover:text-[#483449] font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#F07878] hover:bg-[#e06565] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Submit Enquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
