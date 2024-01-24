<template>
  <div>
    <button class="sidebar" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling"
      aria-controls="offcanvasScrolling"><i class="fa-solid fa-bars"></i></button>

    <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1"
      id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasScrollingLabel"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <p><router-link to="/">Home</router-link></p>
      </div>
    </div>


    <h1 align="center" class="mt-2">Ini Buat Tampilin Data Excel</h1>
    <div class="container">
      <table class="table table-hover table-stripped">
        <tr class="bg-dark text-light">
          <th>FIle Name</th>
          <th>Action</th>
        </tr>
        <tr v-for="i in data" :key="i.id">
          <td>{{ i.fileName }}</td>
          <td>
            <div class="btn-group">
              <button class="btn btn-danger" @click="deleteExcel(i)">Delete</button>
              <button class="btn btn-info" @click="viewExcel(i)">View</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase.js'
import { doc, getDocs, getDoc, deleteDoc, collection } from 'firebase/firestore'
import swal from 'sweetalert'

export default {
  name: 'app',
  data() {
    return {
      data: [],
    }
  },
  mounted() {
    this.fetchTasks()
    console.log(this.data)
  },
  methods: {
    async fetchTasks() {
      try {
        const excelData = await getDocs(collection(db, 'excel'))

        excelData.forEach((data) => {
          this.data.push({ ...data.data(), id: data.id })
        })
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    },
    async viewExcel(i) {
      try {
        const excelDocRef = doc(db, 'excel', i.id);
        const excelDocSnap = await getDoc(excelDocRef);
        console.log(excelDocSnap.data())
        console.log(excelDocSnap.id)
        this.$router.push(`/excel/${excelDocSnap.id}`)
      } catch (error) {
        console.log(error)
      }
    },
    async deleteExcel(i) {
      try {
        swal({
          icon: 'warning',
          title: 'Delete This Data?',
          dangerMode: true,
          buttons: ['No', 'Yes']
        }).then(
          (next) => {
            if (next) {
                deleteDoc(doc(db, 'excel', i.id))

              this.data = this.data.filter((data) => data.id !== i.id)
            }
          }
        )
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 30px;
  border: none;
  border-radius: 7px;
}
</style>
