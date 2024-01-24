<template>
  <header class="masthead">
      <div class="container position-relative">
          <div class="row justify-content-center">
              <div class="col-xl-6">
                  <div class="text-center text-white">
                      <h1 class="mb-5">Bang Cara Nampilin Data Excel Gimana Bang</h1>
                      <form class="form-subscribe" id="contactForm">
                          <div class="row">
                              <div class="col">
                                
                                  <input class="form-control form-control-lg" type="file" @change="handleFileChange" />
                              </div>
                              <div class="col-auto"><button class="btn btn-primary btn-lg" id="submitButton"
                                      @click="exportData">Download Excel</button></div>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </header>
  <section class="features-icons bg-light text-center">
      <div class="container">
          <div class="table-container">
              <div class="table-wrapper">

                  <table ref="table" class="table table-hover table-stripped">
                      <thead>
                          <tr>
                              <th v-for="header in headers" :key="header">{{ header }}</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="(row, index) in data" :key="index">
                              <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

      </div>
  </section>

 

</template>

<script>
// import XLSX from 'xlsx';
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

export default {
  name: 'app',
  data() {
      return {
          data: [],
          headers: [],
      };
  },
  methods: {
      handleFileChange(event) {
          const file = event.target.files[0];
          this.readExcel(file);
          this.$refs.table.scrollIntoView({ behavior: 'smooth' })
      },
      readExcel(file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: "array" });
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
              this.headers = this.getHeaders(sheet);
              this.data = this.getData(sheet);
          };
          reader.readAsArrayBuffer(file);
      },
      getHeaders(sheet) {
          const headers = [];
          const range = XLSX.utils.decode_range(sheet["!ref"]);
          for (let j = range.s.c; j <= range.e.c; j++) {
              const cellAddress = { r: range.s.r, c: j };
              const cellRef = XLSX.utils.encode_cell(cellAddress);
              const cellValue = sheet[cellRef] ? sheet[cellRef].v : "";
              headers.push(cellValue);
          }
          return headers;
      },
      getData(sheet) {
          const data = [];
          const range = XLSX.utils.decode_range(sheet["!ref"]);
          for (let i = range.s.r + 1; i <= range.e.r; i++) {
              const row = [];
              for (let j = range.s.c; j <= range.e.c; j++) {
                  const cellAddress = { r: i, c: j };
                  const cellRef = XLSX.utils.encode_cell(cellAddress);
                  const cellValue = sheet[cellRef] ? sheet[cellRef].v : "";
                  row.push(cellValue);
              }
              data.push(row);
          }
          return data;
      },
      exportData() {
          const ws = XLSX.utils.json_to_sheet(this.data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
          XLSX.writeFile(wb, 'exported_data.xlsx');
      },
  },
};
</script>

<style scoped>
table {
  border: 1px solid black;
}

.table-wrapper {
  display: inline-block;
  /* border: 1px solid black; */

}

.table-container {
  border: 1px solid black;
  overflow-y: auto;
  overflow-x: auto;
}



</style>