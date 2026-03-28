import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, GripVertical, Plus, Trash2, Sun, Moon, Sparkles, Coffee, Book, Heart } from 'lucide-react';
import { motion, Reorder } from 'motion/react';
import { cn } from '../lib/utils';

export default function EditRituals() {
  const navigate = useNavigate();
  const [items, setItems] = React.useState([
    { id: 'morning', title: '早起打卡', icon: Sun, active: true },
    { id: 'sleep', title: '睡眠打卡', icon: Moon, active: true },
    { id: 'work', title: '工作計劃打卡', icon: Book, active: true },
    { id: 'meditation', title: '冥想打卡', icon: Sparkles, active: false },
    { id: 'coffee', title: '晨間咖啡', icon: Coffee, active: false },
    { id: 'exercise', title: '每日運動', icon: Heart, active: false },
  ]);

  const toggleActive = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
  };

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
        <h2 className="serif-title text-2xl font-bold text-primary">編輯打卡項目</h2>
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -mr-2 text-primary hover:bg-primary/5 rounded-full transition-colors"
        >
          <Check size={24} />
        </button>
      </div>

      <p className="text-secondary text-sm mb-8 px-1">
        拖動以調整順序，點擊開關以啟用或禁用打卡項目。
      </p>

      {/* Rituals List */}
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4">
        {items.map((item) => (
          <Reorder.Item 
            key={item.id} 
            value={item}
            className={cn(
              "flex items-center justify-between p-5 rounded-xl transition-all duration-300 border",
              item.active 
                ? "bg-white border-outline-variant/20 shadow-sm" 
                : "bg-surface-variant/20 border-transparent opacity-60"
            )}
          >
            <div className="flex items-center gap-4">
              <GripVertical className="text-outline-variant cursor-grab active:cursor-grabbing" size={20} />
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                item.active ? "bg-primary-container/20 text-primary" : "bg-outline-variant/20 text-outline"
              )}>
                <item.icon size={20} />
              </div>
              <span className={cn(
                "font-medium tracking-tight",
                item.active ? "text-on-surface" : "text-outline"
              )}>
                {item.title}
              </span>
            </div>
            
            <button 
              onClick={() => toggleActive(item.id)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300",
                item.active ? "bg-primary" : "bg-outline-variant"
              )}
            >
              <motion.div 
                animate={{ x: item.active ? 26 : 2 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add Custom Button */}
      <button className="mt-8 w-full py-5 border-2 border-dashed border-outline-variant/30 rounded-xl flex items-center justify-center gap-3 text-outline hover:border-primary-container/50 hover:text-primary transition-all group">
        <Plus size={20} className="group-hover:scale-110 transition-transform" />
        <span className="font-medium tracking-widest uppercase text-xs">添加自定義項目</span>
      </button>
    </div>
  );
}
