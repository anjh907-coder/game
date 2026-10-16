import React from 'react';
import { X, CheckCircle2, ArrowRight, ExternalLink, Code } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ScratchGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchGuideModal: React.FC<ScratchGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-emerald-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500 rounded-xl text-xl">
              🐱
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                스크래치(Scratch)에 캐릭터 넣기
              </h2>
              <p className="text-xs text-emerald-100">
                다운로드받은 스프라이트를 스크래치 게임에 불러오는 4단계 가이드
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playUndo();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 4 Steps */}
        <div className="p-5 sm:p-6 space-y-4 text-slate-700 text-sm">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                투명 PNG 다운로드 버튼 클릭
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                오른쪽 패널에서 <strong>[스크래치용 투명 PNG 다운로드]</strong>를 누르면 컴퓨터의 '다운로드' 폴더에 저장됩니다. (256x256 추천!)
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                스크래치 웹사이트 열고 [만들기]
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                <a
                  href="https://scratch.mit.edu"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold underline inline-flex items-center gap-1"
                >
                  scratch.mit.edu <ExternalLink className="w-3 h-3 inline" />
                </a>
                로 이동하여 상단의 <strong>[만들기]</strong> 버튼을 눌러 프로젝트 창을 엽니다.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                [스프라이트 업로드] 선택하기
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                오른쪽 아래 <strong>고양이 얼굴 아이콘</strong> 위에 마우스를 올린 다음, 맨 위에 있는 <strong>돋보기/업로드(위쪽 화살표 모양)</strong> 버튼을 클릭합니다.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                내 캐릭터 선택하고 코딩 시작!
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                저장해둔 <code>.png</code> 파일을 선택하면 스크래치 무대에 내가 그린 캐릭터가 쏙 들어옵니다!
              </p>
            </div>
          </div>

          {/* Coding Tip Box */}
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-indigo-950">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>선생님이 알려주는 보너스 코딩 팁!</span>
            </div>
            <p className="text-slate-600">
              스크래치에서 내 캐릭터에게 이 블록들을 조립해주면 키보드로 신나게 조종할 수 있어요:
            </p>
            <div className="bg-white p-2 rounded-lg font-mono text-[11px] text-slate-700 border border-indigo-100 space-y-0.5">
              <div>🚩 [깃발을 클릭했을 때]</div>
              <div className="pl-3">🔁 [무한 반복하기]</div>
              <div className="pl-6">❓ [오른쪽 화살표 키를 눌렀는가?] 라면</div>
              <div className="pl-9">➡️ [x좌표를 10만큼 바꾸기]</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-end">
          <button
            onClick={() => {
              sounds.playUndo();
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            확인했어요!
          </button>
        </div>
      </div>
    </div>
  );
};
