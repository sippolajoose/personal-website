<template>
  <div class="shell">
    <header class="topbar">
      <router-link class="brand" to="/">Personal Website</router-link>

      <nav class="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/cv">CV</router-link>
      </nav>
    </header>

    <main class="page">
      <router-view />
    </main>
  </div>
</template>
