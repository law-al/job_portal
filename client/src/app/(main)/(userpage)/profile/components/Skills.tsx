'use client';
import { X } from 'lucide-react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Skills() {
  const [skills, setSkills] = useState<string[]>(['Figma', 'User Research', 'Prototyping', 'HTML/CSS', 'Design Systems']);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill, idx) => (
          <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:text-blue-800">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Add a skill (e.g. React, Photoshop)"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={addSkill} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
