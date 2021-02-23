import { Component, OnInit } from '@angular/core';
import { MediaRecorder } from 'extendable-media-recorder';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-screen-recorder',
  templateUrl: './screen-recorder.component.html',
  styleUrls: ['./screen-recorder.component.scss']
})
export class ScreenRecorderComponent implements OnInit {
  start = document.getElementById("start");
  stop = document.getElementById("stop");
  video = document.querySelector("video");
  recorder: any;
  stream: any;

  async startRecording() {
    const mediaDevices = navigator.mediaDevices as any;
    this.stream = await mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" }
    });

    this.recorder = new MediaRecorder(this.stream);

    const chunks = [];
    this.recorder.ondataavailable = (e) => chunks.push(e.data);
    console.log(this.recorder);
    this.recorder.stop = (e) => {
      if (chunks.length) {
        const completeBlob = new Blob(chunks, { type: chunks[0].type });
        this.video.src = URL.createObjectURL(completeBlob);
        console.log("download");
        saveData(completeBlob, "video.mp4");
      }
    };

    this.recorder.start();
    var saveData = (function () {
      var a = document.createElement("a");
      document.body.appendChild(a);
      return function (data, fileName) {
        var json = JSON.stringify(data),
          blob = new Blob([json], { type: "octet/stream" }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      };
    }());
  }




  constructor() { }

  ngOnInit(): void {


  }
  ngAfterViewInit() {
    this.start = document.getElementById("start");
    this.stop = document.getElementById("stop");
    this.video = document.querySelector("video");

    this.start.addEventListener("click", () => {
      this.start.setAttribute("disabled", "");
      this.stop.removeAttribute("disabled");

      this.startRecording();
    });

    this.stop.addEventListener("click", () => {
      this.stop.setAttribute("disabled", "");
      this.start.removeAttribute("disabled");

      this.recorder.stop();
      this.stream.getVideoTracks()[0].stop();
    });
  }
}
