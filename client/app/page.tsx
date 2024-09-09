'use client'
import Toolbar from "@/components/toolbar";
import SettingBar from "@/components/settingBar";
import Canvas from "@/components/canvas";
import React from "react";

export default function Home() {
  return (
          <div className='h-[100vh] max-h-[100vh] w-[100vw] bg-[#F6F6F6] m-0 p-0 box-border'>
              <Toolbar/>
              <SettingBar/>
              <Canvas/>
          </div>
  );
}

// сделать кнопку пропустить ввод ника и получить случайно сгенерированный
