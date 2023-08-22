<script>
    import { onMount } from 'svelte';
    let spinning = false;
    
    onMount(() => {
      spinning = true;
    });
  </script>
  
  <div class="spinner" style="display: {spinning ? 'block' : 'none'};"></div>
  
  <style>
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border-left-color: #000;
      animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
  