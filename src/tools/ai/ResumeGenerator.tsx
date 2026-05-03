import { useState } from 'react';
import { User } from 'lucide-react';

const ResumeGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
  });
  const [generatedResume, setGeneratedResume] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateResume = () => {
    const resume = `
${formData.name || 'Your Name'}

Contact Information:
Email: ${formData.email || 'your.email@example.com'}
Phone: ${formData.phone || 'Your Phone Number'}

Professional Summary:
${formData.experience || 'Describe your professional background and key achievements here.'}

Skills:
${formData.skills || 'List your key skills and competencies here.'}

Work Experience:
- Add your work experience details here
- Include company names, positions, and dates

Education:
- Add your educational background here
    `.trim();

    setGeneratedResume(resume);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Resume Generator
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Experience Summary</label>
              <textarea
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Skills</label>
              <textarea
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background resize-none"
              />
            </div>
            <button
              onClick={generateResume}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Generate Resume
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Generated Resume</label>
            <pre className="w-full h-96 px-3 py-2 border border-border rounded-lg bg-background whitespace-pre-wrap font-mono text-sm overflow-auto">
              {generatedResume || 'Your generated resume will appear here...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;