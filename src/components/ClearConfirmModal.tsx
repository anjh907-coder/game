import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ClearConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearConfirmModal: React.FC<ClearConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-5 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">
            도화지를 모두 지울까요?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            지금까지 그린 캐릭터가 모두 지워집니다. 계속하시겠습니까?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => {
              sounds.playUndo();
              onCancel();
            }}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            취소 (계속 그리기)
          </button>
          <button
            onClick={() => {
              sounds.playEraser();
              onConfirm();
            }}
            className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>모두 지우기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
