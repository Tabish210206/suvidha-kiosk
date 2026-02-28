'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Backspace, RotateCcw } from 'lucide-react';

interface OnScreenKeyboardProps {
  onInput: (text: string) => void;
  type?: 'text' | 'phone' | 'numeric';
  title?: string;
  placeholder?: string;
  visible?: boolean;
  maxLength?: number;
}

export default function OnScreenKeyboard({
  onInput,
  type = 'text',
  title = 'Enter Text',
  placeholder = 'Tap keys to type',
  visible = true,
  maxLength = 50,
}: OnScreenKeyboardProps) {
  const [inputValue, setInputValue] = useState('');
  const [isCapsLock, setIsCapsLock] = useState(false);

  // Keyboard layouts
  const phoneLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ];

  const numericLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0'],
  ];

  const textLayout = [
    [
      'Q',
      'W',
      'E',
      'R',
      'T',
      'Y',
      'U',
      'I',
      'O',
      'P',
    ],
    [
      'A',
      'S',
      'D',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
    ],
    [
      'Shift',
      'Z',
      'X',
      'C',
      'V',
      'B',
      'N',
      'M',
      'Del',
    ],
    [
      'Space',
      '@',
      '.',
      'Done',
    ],
  ];

  const handleKeyPress = useCallback(
    (key: string) => {
      // Handle special keys
      if (key === 'Shift') {
        setIsCapsLock(!isCapsLock);
        return;
      }

      if (key === 'Del') {
        setInputValue(inputValue.slice(0, -1));
        onInput(inputValue.slice(0, -1));
        return;
      }

      if (key === 'Space') {
        const newValue = inputValue + ' ';
        if (newValue.length <= maxLength) {
          setInputValue(newValue);
          onInput(newValue);
        }
        return;
      }

      if (key === 'Done') {
        // Emit done event or close keyboard
        return;
      }

      // Handle regular characters
      let char = key;
      if (type === 'text' && !isCapsLock && key.length === 1) {
        char = key.toLowerCase();
      }

      const newValue = inputValue + char;
      if (newValue.length <= maxLength) {
        setInputValue(newValue);
        onInput(newValue);
      }
    },
    [inputValue, isCapsLock, type, onInput, maxLength]
  );

  const handleClear = () => {
    setInputValue('');
    onInput('');
  };

  // Select layout based on type
  let layout = textLayout;
  if (type === 'phone') {
    layout = phoneLayout;
  } else if (type === 'numeric') {
    layout = numericLayout;
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t-2 border-gray-300 p-3 shadow-lg z-50">
      {/* Input Display */}
      <div className="mb-3 bg-white rounded-lg border-2 border-gray-300 p-3 min-h-[60px] flex items-center">
        <input
          type={type === 'phone' || type === 'numeric' ? 'tel' : 'text'}
          value={inputValue}
          placeholder={placeholder}
          readOnly
          className="w-full text-lg font-semibold outline-none"
          maxLength={maxLength}
        />
        <Button
          onClick={handleClear}
          variant="ghost"
          size="sm"
          className="ml-2 min-w-[50px] h-[50px] flex items-center justify-center"
          title="Clear all text"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Keyboard Layout */}
      <div className="space-y-2">
        {layout.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-1 justify-center flex-wrap"
          >
            {row.map((key) => {
              const isSpecial =
                ['Shift', 'Del', 'Space', 'Done'].includes(key);
              const isActive =
                key === 'Shift' && isCapsLock;

              return (
                <Button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`
                    min-h-[50px] font-bold rounded-lg transition-all
                    ${
                      key === 'Space'
                        ? 'flex-1 min-w-[200px]'
                        : 'min-w-[40px]'
                    }
                    ${
                      isSpecial
                        ? `${isActive ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white hover:bg-gray-500'}`
                        : 'bg-white border-2 border-gray-300 text-black hover:bg-gray-200'
                    }
                  `}
                >
                  {key === 'Del' ? (
                    <Backspace className="w-5 h-5" />
                  ) : (
                    key
                  )}
                </Button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Character Count */}
      <div className="mt-2 text-center text-xs text-gray-600">
        {inputValue.length} / {maxLength} characters
      </div>
    </div>
  );
}
