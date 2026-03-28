import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function EditProfile() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-primary hover:bg-primary/5 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="serif-title text-2xl font-bold text-primary">編輯個人資料</h2>
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -mr-2 text-primary hover:bg-primary/5 rounded-full transition-colors"
        >
          <Check size={24} />
        </button>
      </div>

      {/* Avatar Edit */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative group cursor-pointer">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary-container p-1">
            <img 
              src="@/assets/a.jpg" 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover grayscale opacity-80 group-hover:opacity-60 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white drop-shadow-md" size={32} />
          </div>
        </div>
        <button className="mt-4 text-primary text-sm font-medium tracking-widest uppercase hover:opacity-70 transition-opacity">
          更換頭像
        </button>
      </div>

      {/* Form */}
      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-label tracking-[0.2em] text-outline uppercase ml-1">用戶名稱</label>
          <input 
            type="text" 
            defaultValue="林深見"
            className="w-full bg-surface-variant/30 border-none rounded-xl px-5 py-4 text-on-surface font-body focus:ring-2 focus:ring-primary-container/50 transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-label tracking-[0.2em] text-outline uppercase ml-1">個人頭銜</label>
          <input 
            type="text" 
            defaultValue="The Quiet Observer"
            className="w-full bg-surface-variant/30 border-none rounded-xl px-5 py-4 text-on-surface font-body focus:ring-2 focus:ring-primary-container/50 transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-label tracking-[0.2em] text-outline uppercase ml-1">個人簡介</label>
          <textarea 
            rows={4}
            defaultValue="在繁雜的世界中，尋找那一抹寧靜。專注於當下，記錄每一個微小的進步。"
            className="w-full bg-surface-variant/30 border-none rounded-xl px-5 py-4 text-on-surface font-body focus:ring-2 focus:ring-primary-container/50 transition-all outline-none resize-none"
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-16 pt-8 border-t border-outline-variant/20">
        <button className="w-full py-4 text-error font-medium tracking-widest uppercase hover:bg-error/5 rounded-xl transition-colors">
          退出登錄
        </button>
      </div>
    </div>
  );
}
