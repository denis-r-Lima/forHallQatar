import fs from "fs";
const { ipcRenderer } = window.require("electron");

export default class StorageFile {
  private path?: string;
  private data?: Buffer;

  public async saveFile() {
    try {
      this.path = await this.getPath();
      this.data = await this.generateData();
      fs.writeFileSync(this.path, this.data);
    } catch (err) {
      console.log(err);
    }
  }

  private async getPath(): Promise<string> {
    ipcRenderer.send("Get save path");

    return new Promise((resolve, reject) => {
      ipcRenderer.once("Save path ready", (_e: any, arg: any) => {
        resolve(arg);
      });
      ipcRenderer.once("Canceled", () => {
        reject("Canceled");
      });
    });
  }

  private async generateData(): Promise<Buffer> {
    ipcRenderer.send("Generate PDF data");

    return new Promise((resolve, reject) => {
      ipcRenderer.once("PDF data ready", (_e: any, arg: Buffer) => {
        resolve(arg);
      });
      ipcRenderer.once("Error", (_e: any, arg: any) => {
        reject(arg);
      });
    });
  }
}