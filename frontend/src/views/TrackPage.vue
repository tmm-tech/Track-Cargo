<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-[#273272] text-white">
      <div class="container mx-auto">
        <div class="flex justify-between items-center py-2 px-4">
          <div class="flex items-center">
            <span class="text-sm">
              <i class="mr-2">📍</i> Texmon Logistics Limited, Kenya
            </span>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="text-sm hover:text-[#ffb600]">
              <i class="mr-1">📱</i> Facebook
            </a>
            <a href="#" class="text-sm hover:text-[#ffb600]">
              <i class="mr-1">📱</i> Twitter
            </a>
            <a href="#" class="text-sm hover:text-[#ffb600]">
              <i class="mr-1">📱</i> WhatsApp
            </a>
            <a href="#" class="text-sm hover:text-[#ffb600]">
              <i class="mr-1">📱</i> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </header>

    <div class="bg-white border-b">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center py-4 px-4">
          <div class="mb-4 md:mb-0">
            <router-link to="/" class="flex items-center">
              <span class="text-2xl font-bold text-[#273272]">Texmon Logistics</span>
            </router-link>
          </div>
          <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <div class="flex items-center">
              <div class="mr-2 text-[#ffb600]">📞</div>
              <div>
                <p class="text-sm text-gray-600">Call Us</p>
                <p class="font-semibold">(+254) 795 616 827</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="mr-2 text-[#ffb600]">✉️</div>
              <div>
                <p class="text-sm text-gray-600">Email Us</p>
                <p class="font-semibold">enquiries@texmonlogistics.co.ke</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <nav class="bg-[#273272] text-white">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex flex-col md:flex-row">
            <button class="md:hidden p-4 text-white focus:outline-none" @click="toggleMobileMenu">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div :class="['md:flex flex-col md:flex-row', { 'hidden': !mobileMenuOpen }]">
              <router-link to="/" class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                Home
              </router-link>
              <a href="#" class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                About Us
              </a>
              <a href="#" class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                Services
              </a>
              <a href="#" class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                Contact Us
              </a>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-6">
            <router-link to="/track"
              class="px-4 py-2 bg-transparent text-white border border-white rounded-md hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors duration-300 inline-block">
              Track Cargo
            </router-link>
          </div>

        </div>
      </div>
    </nav>

    <main class="flex-1 bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-md mx-auto shadow-2xl rounded-xl bg-white">
          <Card class="border-none shadow-none">
            <CardHeader class="bg-[#273272] text-white rounded-t-xl">
              <CardTitle class="text-2xl">Track Your Cargo</CardTitle>
              <CardDescription class="text-gray-200">
                Enter your tracking information to see the current status of your package
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-6">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                  <Label for="tracking-number">Tracking or Dispatch Number</Label>
                  <div class="relative">
                    <Input id="tracking-number" v-model="trackingNumber" placeholder="Container No | Booking No | B/L"
                      class="pr-10 border-gray-300" />
                    <Search class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
                </div>

                <Button type="submit"
                  class="w-full bg-yellow-500 hover:bg-yellow-500 text-primary font-semibold py-2 rounded-md transition-colors duration-300">
                  Track
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>


    <footer class="bg-[#1a1a1a] text-white pt-12 pb-4">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-xl font-bold mb-4">About Us</h3>
            <p class="text-gray-400 mb-4">
              Texmon Logistics Limited, established in 2019, has swiftly evolved into a leading integrated logistics
              solutions provider across East Africa.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">Facebook</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">Twitter</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">WhatsApp</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
                    clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">LinkedIn</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                    clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-bold mb-4">Working Hours</h3>
            <ul class="text-gray-400">
              <li class="flex justify-between mb-2">
                <span>Monday - Friday:</span>
                <span>08:00 - 17:00</span>
              </li>
              <li class="flex justify-between mb-2">
                <span>Saturday:</span>
                <span>Open</span>
              </li>
              <li class="flex justify-between mb-2">
                <span>Sunday and holidays:</span>
                <span>Open</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold mb-4">Services</h3>
            <ul class="text-gray-400 space-y-2">
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Land Freight
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Sea Freight
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Air Freight
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Customs Clearance
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Cross Border Clearance
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Project Cargo
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Reverse Logistics
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-4">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400">Copyright © {{ new Date().getFullYear() }} Texmon Logistics Limited</p>
            <div class="flex space-x-4 mt-4 md:mt-0">
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                About Us
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                Services
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search, ArrowRight, Loader } from 'lucide-vue-next';
import Card from '../components/ui/Card.vue';
import CardHeader from '../components/ui/CardHeader.vue';
import CardTitle from '../components/ui/CardTitle.vue';
import CardDescription from '../components/ui/CardDescription.vue';
import CardContent from '../components/ui/CardContent.vue';
import Button from '../components/ui/Button.vue';
import Input from '../components/ui/Input.vue';
import Label from '../components/ui/Label.vue';
import { mockPackages } from '../data/mock-data';

export default {
  name: 'TrackPage',
  components: {
    Search,
    ArrowRight,
    Loader,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Button,
    Input,
    Label
  },
  setup() {
    const router = useRouter();
    const trackingNumber = ref('');
    const error = ref('');
    const isSubmitting = ref(false);
    const mobileMenuOpen = ref(false);
    const recentSearches = ref([]);

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const clearError = () => {
      error.value = '';
    };

    const saveRecentSearch = (number) => {
      // Add to recent searches if not already there
      if (!recentSearches.value.includes(number)) {
        // Keep only the 5 most recent searches
        recentSearches.value = [number, ...recentSearches.value.slice(0, 4)];
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
      }
    };

    const useRecentSearch = (number) => {
      trackingNumber.value = number;
      handleSubmit();
    };

    const handleSubmit = async () => {
      if (!trackingNumber.value.trim()) {
        error.value = 'Please enter a tracking or dispatch number';
        return;
      }

      isSubmitting.value = true;

      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if package exists in mock data
        const foundPackage = mockPackages.find(
          pkg => pkg.trackingNumber === trackingNumber.value || pkg.dispatchNumber === trackingNumber.value
        );

        if (foundPackage) {
          // Save to recent searches
          saveRecentSearch(trackingNumber.value);

          // Navigate to results page with tracking number
          router.push(`/track/results?number=${trackingNumber.value}`);
        } else {
          error.value = 'No package found with the provided information';
        }
      } catch (err) {
        error.value = 'An error occurred while tracking your package. Please try again.';
        console.error('Tracking error:', err);
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      // Load recent searches from localStorage
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        recentSearches.value = JSON.parse(savedSearches);
      }
    });

    return {
      trackingNumber,
      error,
      isSubmitting,
      mobileMenuOpen,
      recentSearches,
      toggleMobileMenu,
      clearError,
      useRecentSearch,
      handleSubmit
    };
  }
}
</script>