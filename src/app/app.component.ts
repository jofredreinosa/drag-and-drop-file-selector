import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, inject } from '@angular/core';

export interface ItemFile {
  name: string;
  type: string;
  content: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  allowMultipleFiles = true;
  dragOver = false;
  selectedFiles: ItemFile[] = [];
  title = 'filesSelector';

  @ViewChild('inputFileElement') inputFileElement!: ElementRef;
  @ViewChild('dropArea') dropArea!: ElementRef;

  private renderer2 = inject(Renderer2);

  ngAfterViewInit(): void {
    this.listenDragOver();
    this.listenDragLeave();
    this.listenDrop();
  }

  openSelectFileDialog() {
    this.inputFileElement.nativeElement.value = null;
    this.inputFileElement.nativeElement.click();
  }

  onSelectFiles(evt: any) {
    let files = Array.from(evt.target.files);
    files.forEach( f => this.pushFilesInArray(f));
  }

  pushFilesInArray(file: any) {
    const fileAlreadyExists = this.selectedFiles.find(f => f.name === file.name);
    if (fileAlreadyExists) {
      return;
    }

    if (!this.allowMultipleFiles) {
      this.selectedFiles = [];
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let item: ItemFile = {
        name: file.name,
        type: file.type,
        content: reader.result
      }
      this.selectedFiles.unshift(item);
    }
  }

  listenDragOver() {
    this.renderer2.listen(
      this.dropArea.nativeElement, 'dragover', ( event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        this.dragOver = true;
      }
    )
  }

  listenDragLeave() {
    this.renderer2.listen(
      this.dropArea.nativeElement, 'dragleave', ( event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        this.dragOver = false;
      }
    )
  }

  listenDrop() {
    this.renderer2.listen(
      this.dropArea.nativeElement, 'drop', ( event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        this.dragOver = false;
        let files = Array.from(event?.dataTransfer?.files ?? []);
        files.forEach( f => this.pushFilesInArray(f));
      }
    )
  }
}
