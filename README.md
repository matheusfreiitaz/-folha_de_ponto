<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitProfile: Personal Fitness Journey Planner</title>
    <meta name="description" content="Track your fitness goals, dietary preferences, and training progress with customized user profiles">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://unpkg.com/vue@3.5.13/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body class="bg-gray-50">
    <div id="app" class="min-h-screen">
        <header class="bg-blue-600 text-white py-6 shadow-lg">
            <div class="container mx-auto px-4">
                <h1 class="text-3xl font-bold">FitProfile</h1>
                <p class="mt-2">Seu planejador pessoal de jornada de condicionamento físico</p>
            </div>
        </header>

        <main class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-6">Crie seu perfil</h2>
                
                <form @submit.prevent="submitForm" class="space-y-6">
                    <!-- Personal Information -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nome</label>
                            <input v-model="profile.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Idade</label>
                                <input v-model="profile.age" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Altura (cm)</label>
                                <input v-model="profile.height" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Peso (kg)</label>
                                <input v-model="profile.weight" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            </div>
                        </div>
                    </div>

                    <!-- Fitness Goals -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Objetivo</label>
                        <select v-model="profile.goal" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <option value="emagrecer">Emagrecer</option>
                            <option value="massa">Ganhar Massa</option>
                            <option value="manter">Manter</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nível de Experiência</label>
                        <select v-model="profile.experience" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <option value="iniciante">Iniciante</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="avancado">Avançado</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Frequência de Treino (dias por semana)</label>
                        <input v-model="profile.frequency" type="number" min="1" max="7" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    </div>

                    <!-- Dietary Preferences -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Preferências Alimentares</label>
                        <div class="mt-2 space-y-2">
                            <label class="inline-flex items-center">
                                <input type="checkbox" v-model="profile.dietaryPreferences" value="vegetariano" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <span class="ml-2">Vegetariano</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input type="checkbox" v-model="profile.dietaryPreferences" value="vegano" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <span class="ml-2">Vegano</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input type="checkbox" v-model="profile.dietaryPreferences" value="sem_lactose" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <span class="ml-2">Sem Lactose</span>
                            </label>
                        </div>
                    </div>

                    <!-- Goals -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta de Peso/Gordura Corporal</label>
                            <input v-model="profile.weightGoal" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Meta de Performance</label>
                            <input v-model="profile.performanceGoal" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Ex: Correr 5km em 30min">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Prazo para Atingir (meses)</label>
                            <input v-model="profile.deadline" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                    </div>

                    <div class="flex items-center justify-end space-x-4">
                        <button type="button" @click="resetForm" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Limpar
                        </button>
                        <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Salvar Perfil
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <script type="module">
        const { createApp, ref } = Vue;

        createApp({
            setup() {
                const profile = ref({
                    name: '',
                    age: null,
                    height: null,
                    weight: null,
                    goal: '',
                    experience: '',
                    frequency: null,
                    dietaryPreferences: [],
                    weightGoal: '',
                    performanceGoal: '',
                    deadline: null
                });

                const submitForm = () => {
                    console.log('Profile data:', profile.value);
                    // Add API call or storage logic here
                    alert('Perfil salvo com sucesso!');
                };

                const resetForm = () => {
                    profile.value = {
                        name: '',
                        age: null,
                        height: null,
                        weight: null,
                        goal: '',
                        experience: '',
                        frequency: null,
                        dietaryPreferences: [],
                        weightGoal: '',
                        performanceGoal: '',
                        deadline: null
                    };
                };

                return {
                    profile,
                    submitForm,
                    resetForm
                };
            }
        }).mount('#app');
    </script>
</body>
</html>
