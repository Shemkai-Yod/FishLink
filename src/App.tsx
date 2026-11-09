import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import PondSimulation from "./components/PondSimulation";

type Language = "en" | "ha" | "yo" | "pcm";

/**
 * Shared UI phrasebook. All ordinary JSX text and common accessible/form
 * attributes pass through this layer, so language changes update the whole
 * rendered screen without duplicating page markup.
 */
const uiPhrasebook: Record<string, Partial<Record<Language, string>>> = {
  "Connect · Learn · Grow": { ha: "Haɗa · Koya · Ci gaba", yo: "Sopọ · Kọ́ ẹ̀kọ́ · Dàgbàsókè", pcm: "Connect · Learn · Grow" },
  "Choose language": { ha: "Zaɓi harshe", yo: "Yan èdè", pcm: "Choose language" },
  "MAIN MENU": { ha: "BABBAR MENU", yo: "ÀKÓJỌ ÀKỌ́KỌ́", pcm: "MAIN MENU" },
  "YOUR FISHLINK WORKSPACE": { ha: "WURIN AIKI NA FISHLINK", yo: "ÀGBÈGBÈ IṢẸ́ FISHLINK RẸ", pcm: "YOUR FISHLINK WORKSPACE" },
  "Water Quality Overview": { ha: "Takaitaccen Ingancin Ruwa", yo: "Àkótán Dídára Omi", pcm: "Water Quality Overview" },
  "Latest recorded water reading": { ha: "Sabon ma'aunin ruwan da aka rubuta", yo: "Ìwọ̀n omi tuntun tí a kọ sílẹ̀", pcm: "The latest water reading we record" },
  "Explore FishLink": { ha: "Bincika FishLink", yo: "Ṣàwárí FishLink", pcm: "Explore FishLink" },
  "Choose where you want to go next.": { ha: "Zaɓi inda kake son zuwa na gaba.", yo: "Yan ibi tí o fẹ́ lọ sí lẹ́yìn náà.", pcm: "Choose where you wan go next." },
  "Manage ponds and production": { ha: "Sarrafa tafkuna da samarwa", yo: "Ṣàkóso àwọn adágún àti iṣẹ́ àgbéjáde", pcm: "Manage ponds and production" },
  "Discover products and services": { ha: "Nemo kayayyaki da ayyuka", yo: "Wá ọjà àti iṣẹ́", pcm: "Find products and services" },
  "Connect and learn together": { ha: "Haɗuwa da koyo tare", yo: "Sopọ̀ kí ẹ sì kọ́ ẹ̀kọ́ pọ̀", pcm: "Connect and learn together" },
  "Your registered farms": { ha: "Gonakin da ka yi rajista", yo: "Àwọn oko tí o forúkọ sílẹ̀", pcm: "Your registered farms" },
  "Add a Farm": { ha: "Ƙara Gona", yo: "Fi Oko Kun", pcm: "Add Farm" },
  "Save Farm": { ha: "Ajiye Gona", yo: "Fi Oko Pamọ́", pcm: "Save Farm" },
  "Add a Pond": { ha: "Ƙara Tafki", yo: "Fi Adágún Kun", pcm: "Add Pond" },
  "Save Pond": { ha: "Ajiye Tafki", yo: "Fi Adágún Pamọ́", pcm: "Save Pond" },
  "Choose a farm": { ha: "Zaɓi gona", yo: "Yan oko kan", pcm: "Choose farm" },
  "All farms": { ha: "Duk gonaki", yo: "Gbogbo àwọn oko", pcm: "All farms" },
  "Feeding Records": { ha: "Bayanan Ciyarwa", yo: "Àkọsílẹ̀ Oúnjẹ Ẹja", pcm: "Feeding Records" },
  "Record Feeding": { ha: "Rubuta Ciyarwa", yo: "Kọ Àkọsílẹ̀ Oúnjẹ", pcm: "Record Feeding" },
  "Choose a pond": { ha: "Zaɓi tafki", yo: "Yan adágún kan", pcm: "Choose pond" },
  "Water Monitoring": { ha: "Sa ido kan Ruwa", yo: "Ìṣọ́ Omi", pcm: "Water Monitoring" },
  "Record water quality measurements.": { ha: "Rubuta ma'aunin ingancin ruwa.", yo: "Kọ ìwọ̀n dídára omi sílẹ̀.", pcm: "Record water quality measurements." },
  "New Water Reading": { ha: "Sabon Ma'aunin Ruwa", yo: "Ìwọ̀n Omi Tuntun", pcm: "New Water Reading" },
  "Publish a Listing": { ha: "Sanya Kaya a Kasuwa", yo: "Gbé Ọjà jáde", pcm: "Put Listing for Market" },
  "Featured Products": { ha: "Kayayyakin da Aka Zaɓa", yo: "Àwọn Ọjà Pàtàkì", pcm: "Featured Products" },
  "Search products and services...": { ha: "Nemo kayayyaki da ayyuka...", yo: "Wá ọjà àti iṣẹ́...", pcm: "Search products and services..." },
  "What are you selling?": { ha: "Me kake sayarwa?", yo: "Kí ni o ń tà?", pcm: "Wetin you dey sell?" },
  "Product details": { ha: "Bayanin kaya", yo: "Àlàyé ọjà", pcm: "Product details" },
  "Community": { ha: "Al'umma", yo: "Àwùjọ", pcm: "Community" },
  "Grow Together": { ha: "Ci Gaba Tare", yo: "Ẹ Jẹ́ Ká Dàgbàsókè Pọ̀", pcm: "Make We Grow Together" },
  "Farmers Group": { ha: "Ƙungiyar Manoma", yo: "Ẹgbẹ́ Àwọn Agbe", pcm: "Farmers Group" },
  "Write a message...": { ha: "Rubuta saƙo...", yo: "Kọ ìránṣẹ́...", pcm: "Write message..." },
  "Send ➤": { ha: "Aika ➤", yo: "Fi ránṣẹ́ ➤", pcm: "Send ➤" },
  "FishLink AI Assistant": { ha: "Mataimakin AI na FishLink", yo: "Olùrànlọ́wọ́ AI FishLink", pcm: "FishLink AI Assistant" },
  "Account type": { ha: "Nau'in asusu", yo: "Irú Àkọọ́lẹ̀", pcm: "Account type" },
  "Language": { ha: "Harshe", yo: "Èdè", pcm: "Language" },
  "Farms": { ha: "Gonaki", yo: "Àwọn Oko", pcm: "Farms" },
  "Ponds": { ha: "Tafkuna", yo: "Àwọn Adágún", pcm: "Ponds" },
  "Fish Population": { ha: "Yawan Kifi", yo: "Iye Ẹja", pcm: "Number of Fish" },
  "Continue as Guest →": { ha: "Ci gaba a matsayin Baƙo →", yo: "Tẹ̀síwájú gẹ́gẹ́ bí Àlejò →", pcm: "Continue as Guest →" },
  "Your full name": { ha: "Cikakken sunanka", yo: "Orúkọ rẹ ní kíkún", pcm: "Your full name" },
  "Your phone number": { ha: "Lambar wayarka", yo: "Nọ́mbà fóònù rẹ", pcm: "Your phone number" },
  "How are you joining FishLink?": { ha: "Ta yaya kake shiga FishLink?", yo: "Báwo ni o ṣe ń darapọ̀ mọ́ FishLink?", pcm: "How you wan take join FishLink?" },
  "Email address": { ha: "Adireshin imel", yo: "Àdírẹ́sì ímeèlì", pcm: "Email address" },
  "At least 6 characters": { ha: "Aƙalla haruffa 6", yo: "Ó kéré tán àmì 6", pcm: "At least 6 characters" },
  "Please complete all required fields.": { ha: "Da fatan cika dukkan wuraren da ake buƙata.", yo: "Jọ̀wọ́ kún gbogbo ààyè tó ṣe pàtàkì.", pcm: "Abeg fill all the required fields." },
  "Password must contain at least 6 characters.": { ha: "Kalmar sirri dole ta ƙunshi aƙalla haruffa 6.", yo: "Ọ̀rọ̀ aṣínà gbọ́dọ̀ ní àmì mẹ́fà ó kéré tán.", pcm: "Password must get at least 6 characters." },
  "Please select your FishLink track.": { ha: "Da fatan zaɓi rukunin FishLink naka.", yo: "Jọ̀wọ́ yan ẹ̀ka FishLink rẹ.", pcm: "Abeg choose your FishLink track." },
  "Please specify your category.": { ha: "Da fatan bayyana rukuninka.", yo: "Jọ̀wọ́ ṣàlàyé ẹ̀ka rẹ.", pcm: "Abeg specify your category." },
  "Welcome to FishLink!": { ha: "Barka da zuwa FishLink!", yo: "Ẹ káàbọ̀ sí FishLink!", pcm: "Welcome to FishLink!" },
  "Welcome back!": { ha: "Barka da dawowa!", yo: "Ẹ káàbọ̀ padà!", pcm: "Welcome back!" },
  "You are exploring FishLink as a guest.": { ha: "Kana binciken FishLink a matsayin baƙo.", yo: "O ń wo FishLink gẹ́gẹ́ bí àlejò.", pcm: "You dey explore FishLink as guest." },
  "No farms added yet": { ha: "Ba a ƙara gona ba tukuna", yo: "A kò tíì fi oko kún un", pcm: "You never add any farm yet" },
  "No ponds added yet": { ha: "Ba a ƙara tafki ba tukuna", yo: "A kò tíì fi adágún kún un", pcm: "You never add any pond yet" },
  "No feeding records": { ha: "Babu bayanan ciyarwa", yo: "Kò sí àkọsílẹ̀ oúnjẹ", pcm: "No feeding record yet" },
  "No water readings": { ha: "Babu ma'aunin ruwa", yo: "Kò sí ìwọ̀n omi", pcm: "No water reading yet" },
  "No matching products": { ha: "Ba a sami kayayyakin da suka dace ba", yo: "A kò rí ọjà tó bá mu", pcm: "No matching products" },
  "Live Pond Simulation": { ha: "Kwaikwayon Tafki Kai Tsaye", yo: "Àfarawé Adágún Ẹja Lójú Ẹsẹ̀", pcm: "Live Pond Simulation" },
  "Simulation environment": { ha: "Muhallin Kwaikwayo", yo: "Àyíká Àfarawé", pcm: "Simulation environment" },
  "Select a registered pond to provide context to the simulation.": { ha: "Zaɓi tafkin da aka yi rajista domin ba da bayanai ga kwaikwayon.", yo: "Yan adágún tí a forúkọ sílẹ̀ láti pèsè àlàyé fún àfarawé náà.", pcm: "Choose registered pond make the simulation get context." },
  "Connected FishLink pond": { ha: "Tafkin FishLink da aka haɗa", yo: "Adágún FishLink tí a so pọ̀", pcm: "Connected FishLink pond" },
  "Your interactive pond will appear here": { ha: "Tafkin hulɗarka zai bayyana a nan", yo: "Adágún ìbáṣepọ̀ rẹ yóò hàn níbí", pcm: "Your interactive pond go show here" },
  "For the simulation developer": { ha: "Ga mai haɓaka kwaikwayon", yo: "Fún ẹni tó ń ṣe àfarawé náà", pcm: "For the simulation developer" },
  "FishLink · Connect · Learn · Grow": { ha: "FishLink · Haɗa · Koya · Ci gaba", yo: "FishLink · Sopọ · Kọ́ ẹ̀kọ́ · Dàgbàsókè", pcm: "FishLink · Connect · Learn · Grow" },
  "Full Name": { ha: "Cikakken Suna", yo: "Orúkọ Kíkún", pcm: "Full Name" },
  "Phone Number": { ha: "Lambar Waya", yo: "Nọ́mbà Fóònù", pcm: "Phone Number" },
  "Choose the track that best describes you.": { ha: "Zaɓi rukunin da ya fi bayyana kai.", yo: "Yan ẹ̀ka tó ṣàpèjúwe rẹ jù.", pcm: "Choose the track wey describe you pass." },
  "Specify your category": { ha: "Bayyana rukuninka", yo: "Ṣàlàyé ẹ̀ka rẹ", pcm: "Specify your category" },
  "Email Address": { ha: "Adireshin Imel", yo: "Àdírẹ́sì Ímeèlì", pcm: "Email Address" },
  "Password": { ha: "Kalmar Sirri", yo: "Ọ̀rọ̀ Aṣínà", pcm: "Password" },
  "Remember me": { ha: "Ka tuna da ni", yo: "Rántí mi", pcm: "Remember me" },
  "Back": { ha: "Koma Baya", yo: "Padà", pcm: "Back" },
  "View": { ha: "Duba", yo: "Wo", pcm: "View" },
  "View Farms": { ha: "Duba Gonaki", yo: "Wo Àwọn Oko", pcm: "View Farms" },
  "View Ponds →": { ha: "Duba Tafkuna →", yo: "Wo Àwọn Adágún →", pcm: "View Ponds →" },
  "Farm Name": { ha: "Sunan Gona", yo: "Orúkọ Oko", pcm: "Farm Name" },
  "Location": { ha: "Wuri", yo: "Ibi", pcm: "Location" },
  "Pond Name": { ha: "Sunan Tafki", yo: "Orúkọ Adágún", pcm: "Pond Name" },
  "Length (m)": { ha: "Tsawo (m)", yo: "Gígùn (m)", pcm: "Length (m)" },
  "Width (m)": { ha: "Faɗi (m)", yo: "Fífẹ̀ (m)", pcm: "Width (m)" },
  "Cancel": { ha: "Soke", yo: "Fagilé", pcm: "Cancel" },
  "Filter by farm": { ha: "Tace bisa gona", yo: "Ṣàlẹ̀ nípasẹ̀ oko", pcm: "Filter by farm" },
  "Track feed quantities and feeding dates.": { ha: "Bibiyar yawan abinci da ranakun ciyarwa.", yo: "Tọpinpin iye oúnjẹ àti ọjọ́ fífún ẹja jẹ.", pcm: "Track feed quantity and feeding dates." },
  "Feed Quantity (kg)": { ha: "Yawan Abinci (kg)", yo: "Iye Oúnjẹ (kg)", pcm: "Feed Quantity (kg)" },
  "Date": { ha: "Kwanan Wata", yo: "Ọjọ́", pcm: "Date" },
  "Save Record": { ha: "Ajiye Bayani", yo: "Fi Àkọsílẹ̀ Pamọ́", pcm: "Save Record" },
  "Temperature (°C)": { ha: "Zafin Ruwa (°C)", yo: "Ìwọ̀n Ooru (°C)", pcm: "Temperature (°C)" },
  "Dissolved Oxygen (mg/L)": { ha: "Iskar Oxygen a Ruwa (mg/L)", yo: "Oksíjìn Tí Ó Tú Nínú Omi (mg/L)", pcm: "Dissolved Oxygen (mg/L)" },
  "Water Level (m)": { ha: "Matakin Ruwa (m)", yo: "Ìpele Omi (m)", pcm: "Water Level (m)" },
  "These readings are entered manually. ESP32 sensor integration can be added later.": { ha: "Ana shigar da waɗannan ma'aunai da hannu. Za a iya haɗa na'urorin ESP32 daga baya.", yo: "A ń tẹ àwọn ìwọ̀n wọ̀nyí sílẹ̀ ní ọwọ́. A lè so sensọ̀ ESP32 pọ̀ ní ọjọ́ iwájú.", pcm: "Person dey enter these readings by hand. We fit connect ESP32 sensors later." },
  "Product or Service": { ha: "Kaya ko Aiki", yo: "Ọjà tàbí Iṣẹ́", pcm: "Product or Service" },
  "Category": { ha: "Rukuni", yo: "Ẹ̀ka", pcm: "Category" },
  "Price (₦)": { ha: "Farashi (₦)", yo: "Iye Owó (₦)", pcm: "Price (₦)" },
  "Description": { ha: "Bayani", yo: "Àpèjúwe", pcm: "Description" },
  "Publish Listing": { ha: "Sanya a Kasuwa", yo: "Gbé Ọjà Jáde", pcm: "Publish Listing" },
  "Contact Seller": { ha: "Tuntuɓi Mai Sayarwa", yo: "Kàn sí Olùtajà", pcm: "Contact Seller" },
  "Featured products are illustrative prototype listings, not verified live seller offers.": { ha: "Kayayyakin da aka nuna misalai ne na gwaji, ba tayin masu sayarwa da aka tabbatar ba.", yo: "Àwọn ọjà tí a fihàn jẹ́ àpẹẹrẹ ìdánwò, kì í ṣe àwọn ìpèsè olùtajà tí a ti jẹ́rìí sí.", pcm: "These products na demo listings, no be verified live seller offers." },
  "Share experiences, ask questions and learn from the FishLink community.": { ha: "Raba gogewa, yi tambayoyi, kuma koya daga al'ummar FishLink.", yo: "Pín ìrírí, béèrè ìbéèrè, kí o sì kọ́ láti ọ̀dọ̀ àwùjọ FishLink.", pcm: "Share your experience, ask questions and learn from FishLink community." },
  "Community preview · Local prototype": { ha: "Samfurin al'umma · Gwaji na cikin gida", yo: "Àwòrán àwùjọ · Àpẹẹrẹ agbègbè", pcm: "Community preview · Local prototype" },
  "Ask about feeding, water quality, catfish growth and pond management.": { ha: "Yi tambaya kan ciyarwa, ingancin ruwa, haɓakar kifi da kula da tafki.", yo: "Béèrè nípa fífún ẹja jẹ, dídára omi, ìdàgbàsókè ẹja àti ìṣàkóso adágún.", pcm: "Ask about feeding, water quality, catfish growth and pond management." },
  "Open AI Assistant": { ha: "Buɗe Mataimakin AI", yo: "Ṣí Olùrànlọ́wọ́ AI", pcm: "Open AI Assistant" },
  "FishLink prototype: account details and farm records are stored locally in this browser. Secure authentication and cross-device accounts require the backend.": { ha: "Samfurin FishLink: ana adana bayanan asusu da gonaki a wannan burauzar. Shiga mai tsaro da amfani da asusu a na'urori daban-daban na buƙatar backend.", yo: "Àpẹẹrẹ FishLink: a ń tọ́jú àlàyé àkọọ́lẹ̀ àti àkọsílẹ̀ oko sínú browser yìí. Ìwọlé tó ní ààbò àti lílo àkọọ́lẹ̀ lórí ẹ̀rọ púpọ̀ nílò backend.", pcm: "FishLink prototype: account and farm records dey inside this browser. Secure login and using one account across devices need backend." },
  "Fish Farmer": { ha: "Manomin Kifi", yo: "Agbe Ẹja", pcm: "Fish Farmer" },
  "Veterinary Doctor": { ha: "Likitan Dabbobi", yo: "Dókítà Ẹranko", pcm: "Veterinary Doctor" },
  "Seller / Supplier": { ha: "Mai Sayarwa / Mai Kaya", yo: "Olùtajà / Olùpèsè", pcm: "Seller / Supplier" },
  "Enthusiast": { ha: "Mai Sha'awar Kifi", yo: "Olùfẹ́ Ẹja", pcm: "Fish Farming Enthusiast" },
  "Individual": { ha: "Mutum", yo: "Ẹnì kọ̀ọ̀kan", pcm: "Individual" },
  "Other": { ha: "Wani", yo: "Òmíràn", pcm: "Other" },
  "Select language": { ha: "Zaɓi harshe", yo: "Yan èdè", pcm: "Choose language" },
  "← Back": { ha: "← Koma Baya", yo: "← Padà", pcm: "← Back" },
  "CONNECT · LEARN · GROW": { ha: "HAƊA · KOYO · CI GABA", yo: "SỌPỌ · KỌ́ Ẹ̀KỌ́ · DÀGBÀSÓKÈ", pcm: "CONNECT · LEARN · GROW" },
  "My Farms": { ha: "Gonakina", yo: "Àwọn Oko Mi", pcm: "My Farms" },
  "Farm": { ha: "Gona", yo: "Oko", pcm: "Farm" },
  "Pond": { ha: "Tafki", yo: "Adágún", pcm: "Pond" },
  "ponds": { ha: "tafkuna", yo: "adágún", pcm: "ponds" },
  "Marketplace": { ha: "Kasuwa", yo: "Ọjà", pcm: "Market" },
  "+ Record Feeding": { ha: "+ Rubuta Ciyarwa", yo: "+ Kọ Àkọsílẹ̀ Oúnjẹ", pcm: "+ Record Feeding" },
  "+ Add Reading": { ha: "+ Ƙara Ma'auni", yo: "+ Fi Ìwọ̀n Kún", pcm: "+ Add Reading" },
  "Save Reading": { ha: "Ajiye Ma'auni", yo: "Fi Ìwọ̀n Pamọ́", pcm: "Save Reading" },
  "Community message": { ha: "Saƙon al'umma", yo: "Ìránṣẹ́ Àwùjọ", pcm: "Community message" },
  "My Profile": { ha: "Bayanan Kai", yo: "Profaili Mi", pcm: "My Profile" },
  "Manage My Farms": { ha: "Sarrafa Gonakina", yo: "Ṣàkóso Àwọn Oko Mi", pcm: "Manage My Farms" },
  "e.g. Researcher, Student, Investor": { ha: "misali Mai Bincike, Ɗalibi, Mai Zuba Jari", yo: "àpẹẹrẹ Oluwadi, Akẹ́kọ̀ọ́, Olùdókòwò", pcm: "e.g. Researcher, Student, Investor" },
  "Open profile": { ha: "Buɗe bayanan kai", yo: "Ṣí profaili", pcm: "Open profile" },
  "Welcome,": { ha: "Barka da zuwa,", yo: "Ẹ káàbọ̀,", pcm: "Welcome," },
  "No water readings yet": { ha: "Ba a shigar da ma'aunin ruwa ba tukuna", yo: "A kò tíì tẹ ìwọ̀n omi sílẹ̀", pcm: "No water reading yet" },
  "Production": { ha: "Samarwa", yo: "Ìṣẹ́ Àgbéjáde", pcm: "Production" },
  "Pond Simulation": { ha: "Kwaikwayon Tafki", yo: "Àfarawé Adágún", pcm: "Pond Simulation" },
  "e.g. Green Valley Farm": { ha: "misali Gonakin Green Valley", yo: "àpẹẹrẹ Oko Green Valley", pcm: "e.g. Green Valley Farm" },
  "Farm location": { ha: "Wurin gona", yo: "Ibi tí oko wà", pcm: "Farm location" },
  "Pond 1": { ha: "Tafki na 1", yo: "Adágún 1", pcm: "Pond 1" },
  "items available": { ha: "kaya suna nan", yo: "ọjà wà nílẹ̀", pcm: "items dey available" },
  "Seller:": { ha: "Mai sayarwa:", yo: "Olùtajà:", pcm: "Seller:" },
  "Fish Farmer description": { ha: "Sarrafa gonaki, tafkuna, bayanan ciyarwa, yawan kifi da ingancin ruwa.", yo: "Ṣàkóso oko, adágún, àkọsílẹ̀ oúnjẹ, iye ẹja àti dídára omi.", pcm: "Manage farms, ponds, feeding records, fish population and water quality." },
  "Manage farms, ponds, feeding records, fish population and water quality.": { ha: "Sarrafa gonaki, tafkuna, bayanan ciyarwa, yawan kifi da ingancin ruwa.", yo: "Ṣàkóso oko, adágún, àkọsílẹ̀ oúnjẹ, iye ẹja àti dídára omi.", pcm: "Manage farms, ponds, feeding records, fish population and water quality." },
  "Support fish health, review farm concerns and share professional guidance.": { ha: "Taimaka wa lafiyar kifi, duba matsalolin gona da bayar da shawarwarin ƙwararru.", yo: "Ṣètìlẹ́yìn fún ìlera ẹja, ṣàyẹ̀wò ìṣòro oko kí o sì pèsè ìmọ̀ràn amọ̀jọ̀gbọ́n.", pcm: "Support fish health, review farm issues and give professional advice." },
  "Showcase fish, feed, fingerlings, equipment and farming services.": { ha: "Nuna kifi, abinci, ƙananan kifaye, kayan aiki da ayyukan noma.", yo: "Ṣàfihàn ẹja, oúnjẹ, ọmọ ẹja, ohun èlò àti iṣẹ́ oko.", pcm: "Show fish, feed, fingerlings, equipment and farming services." },
  "Explore fish farming, learn from the community and discover useful resources.": { ha: "Bincika kiwon kifi, koya daga al'umma kuma nemo kayan taimako.", yo: "Ṣàwárí iṣẹ́ oko ẹja, kọ́ láti àwùjọ, kí o sì rí ohun èlò tó wúlò.", pcm: "Explore fish farming, learn from community and find useful resources." },
  "Explore FishLink, connect with people and follow fish farming activities.": { ha: "Bincika FishLink, haɗu da mutane kuma bibiyi ayyukan kiwon kifi.", yo: "Ṣàwárí FishLink, bá ènìyàn pàdé, kí o sì tẹ̀lé iṣẹ́ oko ẹja.", pcm: "Explore FishLink, connect with people and follow fish farming activities." },
  "Your FishLink workspace is ready. Explore the platform and customize your activities.": { ha: "Wurin aikinka na FishLink ya shirya. Bincika dandamalin kuma tsara ayyukanka.", yo: "Ibi iṣẹ́ FishLink rẹ ti ṣetán. Ṣàwárí ètò náà kí o sì ṣètò àwọn iṣẹ́ rẹ.", pcm: "Your FishLink workspace don ready. Explore the platform and arrange your activities." },
};

function translateUiText(value: string, language: Language): string {
  if (language === "en") return value;
  const trimmed = value.trim();
  const translated = uiPhrasebook[trimmed]?.[language];
  if (!translated) return value;
  return value === trimmed ? translated : value.replace(trimmed, translated);
}

function LocalizedTree({ children, language }: { children: React.ReactNode; language: Language }) {
  const visit = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") return translateUiText(node, language);
    if (typeof node === "number" || node == null || typeof node === "boolean") return node;
    if (Array.isArray(node)) return node.map((child, index) => <React.Fragment key={index}>{visit(child)}</React.Fragment>);
    if (React.isValidElement<Record<string, unknown>>(node)) {
      const props = { ...node.props };
      for (const attribute of ["placeholder", "title", "aria-label", "description", "label", "sub"]) {
        if (typeof props[attribute] === "string") props[attribute] = translateUiText(props[attribute] as string, language);
      }
      if ("children" in props) props.children = visit(props.children as React.ReactNode);
      return React.cloneElement(node, props);
    }
    return node;
  };
  return <>{visit(children)}</>;
}

type Track =
  | "Fish Farmer"
  | "Veterinary Doctor"
  | "Seller / Supplier"
  | "Enthusiast"
  | "Individual"
  | "Other";

type Page =
  | "welcome"
  | "auth"
  | "dashboard"
  | "farms"
  | "marketplace"
  | "community"
  | "profile";

type User = {
  name: string;
  email: string;
  phone?: string;
  role: Track | string;
  otherRole?: string;
  guest?: boolean;
};

type Farm = {
  id: string;
  name: string;
  location: string;
};

type Pond = {
  id: string;
  farmId: string;
  name: string;
  population: number;
  length: number;
  width: number;
  status: string;
};

type Feeding = {
  id: string;
  pondId: string;
  amount: number;
  date: string;
};

type Reading = {
  id: string;
  pondId: string;
  temperature: number;
  oxygen: number;
  ph: number;
  level: number;
  date: string;
};

type Listing = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  seller: string;
  emoji: string;
};

type Message = {
  id: string;
  sender: string;
  text: string;
  date: string;
  mine?: boolean;
  role?: string;
};


type AppData = {
  user: User | null;
  language: Language;
  farms: Farm[];
  ponds: Pond[];
  feedings: Feeding[];
  readings: Reading[];
  listings: Listing[];
  messages: Message[];
};

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const today = () => {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
};

function safeStorageGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function safeStorageSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* Storage may be blocked or full. */ }
}

function safeStorageRemove(key: string): void {
  try { window.localStorage.removeItem(key); } catch { /* Storage may be blocked. */ }
}

const money = (n: number) => `₦${n.toLocaleString("en-NG")}`;

const accountTypes: Track[] = [
  "Fish Farmer",
  "Veterinary Doctor",
  "Seller / Supplier",
  "Enthusiast",
  "Individual",
  "Other",
];

const starterListings: Listing[] = [
  {
    id: "listing-1",
    name: "Live Catfish",
    category: "Fish",
    price: 2500,
    description: "Fresh live catfish available for pickup.",
    seller: "Green Valley Farm",
    emoji: "🐟",
  },
  {
    id: "listing-2",
    name: "Catfish Feed (15kg)",
    category: "Feed",
    price: 28000,
    description: "Floating feed suitable for growing catfish.",
    seller: "AgroFeed Ltd",
    emoji: "🌾",
  },
  {
    id: "listing-3",
    name: "Catfish Fingerlings",
    category: "Fingerlings",
    price: 75,
    description: "Healthy fingerlings from a hatchery.",
    seller: "FreshFinger Hatchery",
    emoji: "🐠",
  },
  {
    id: "listing-4",
    name: "Water Quality Test Kit",
    category: "Equipment",
    price: 18500,
    description: "Test pH and basic pond water conditions.",
    seller: "AquaTech Supplies",
    emoji: "🧪",
  },
  {
    id: "listing-5",
    name: "Pond Health Consultation",
    category: "Services",
    price: 10000,
    description: "Professional pond assessment and advice.",
    seller: "Dr. Emmanuel",
    emoji: "🩺",
  },
  {
    id: "listing-6",
    name: "Pond Aerator",
    category: "Equipment",
    price: 65000,
    description: "Aeration equipment for improved oxygenation.",
    seller: "AquaTech Supplies",
    emoji: "💧",
  },
];

const starterMessages: Message[] = [
  {
    id: "msg-1",
    sender: "Emmanuel",
    role: "Fish Farmer",
    text: "My pond water became cloudy after feeding. Any suggestions?",
    date: "Today",
  },
  {
    id: "msg-2",
    sender: "Tunde",
    role: "Fish Farmer",
    text: "Check the amount of feed and remove any uneaten feed.",
    date: "Today",
  },
  {
    id: "msg-3",
    sender: "Dr. Emmanuel",
    role: "Veterinary Doctor",
    text: "Good water quality is important. Check dissolved oxygen and ammonia if possible.",
    date: "Yesterday",
  },
];

const initialData: AppData = {
  user: null,
  language: "en",
  farms: [],
  ponds: [],
  feedings: [],
  readings: [],
  listings: starterListings,
  messages: starterMessages,
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Smarter Fish Farming Together",
    description:
      "Manage your ponds, buy and sell, get expert advice, and grow your fish business — all in one place.",
    getStarted: "Get Started",
    login: "Login",
    dashboard: "Dashboard",
    farms: "My Farms",
    marketplace: "Marketplace",
    community: "Community",
    profile: "Profile",
    greeting: "Here's what's happening on your farm today.",
    addFarm: "Add Farm",
    addPond: "Add Pond",
    logout: "Log Out",
  },

  ha: {
    welcome: "Kiwo Kifi Mai Sauki Tare",
    description:
      "Sarrafa tafkunanka, saya da sayarwa, samun shawarar masana, da bunkasa kasuwancinka na kifi.",
    getStarted: "Fara Yanzu",
    login: "Shiga",
    dashboard: "Babban Shafi",
    farms: "Gonakina",
    marketplace: "Kasuwa",
    community: "Al'umma",
    profile: "Bayanan Kai",
    greeting: "Ga abin da ke faruwa a gonarka yau.",
    addFarm: "Ƙara Gona",
    addPond: "Ƙara Tafki",
    logout: "Fita",
  },

  yo: {
    welcome: "Ise Oko Eja To Rorun Papọ",
    description:
      "Se akoso awon adagun eja re, ra ati ta, gba imoran awon amoye, ki o si se agbekale ise oko eja re.",
    getStarted: "Bere Bayi",
    login: "Wole",
    dashboard: "Oju Iṣakoso",
    farms: "Awon Oko Mi",
    marketplace: "Oja",
    community: "Awon Eniyan",
    profile: "Profaili",
    greeting: "Eyi ni ohun to n sele ni oko re loni.",
    addFarm: "Fi Oko Kun",
    addPond: "Fi Adagun Kun",
    logout: "Jade",
  },

  pcm: {
    welcome: "Better Fish Farming Together",
    description:
      "Manage your ponds, buy and sell fish, get expert advice, and grow your fish business for one place.",
    getStarted: "Start Now",
    login: "Login",
    dashboard: "Dashboard",
    farms: "My Farms",
    marketplace: "Market",
    community: "Community",
    profile: "Profile",
    greeting: "See wetin dey happen for your farm today.",
    addFarm: "Add Farm",
    addPond: "Add Pond",
    logout: "Log Out",
  },
};

const trackDescriptions: Record<string, string> = {
  "Fish Farmer":
    "Manage farms, ponds, feeding records, fish population and water quality.",

  "Veterinary Doctor":
    "Support fish health, review farm concerns and share professional guidance.",

  "Seller / Supplier":
    "Showcase fish, feed, fingerlings, equipment and farming services.",

  Enthusiast:
    "Explore fish farming, learn from the community and discover useful resources.",

  Individual:
    "Explore FishLink, connect with people and follow fish farming activities.",

  Other:
    "Your FishLink workspace is ready. Explore the platform and customize your activities.",
};

const trackMetrics: Record<string, string[]> = {
  "Fish Farmer": ["Farms", "Ponds", "Fish Population", "Feed Records"],
  "Veterinary Doctor": [
    "Farmers",
    "Health Topics",
    "Consultations",
    "Community",
  ],
  "Seller / Supplier": [
    "Listings",
    "Product Categories",
    "Customers",
    "Orders",
  ],
  Enthusiast: [
    "Learning Topics",
    "Community Posts",
    "Farmers",
    "Resources",
  ],
  Individual: ["Community", "Marketplace", "Farmers", "Resources"],
  Other: ["Marketplace", "Community", "Farms", "Resources"],
};

function readSavedData(): AppData {
  try {
    const saved = safeStorageGet("fishlink-data-v2");

    if (!saved) return initialData;

    const parsed: Partial<AppData> = JSON.parse(saved);
    const validLanguage: Language = ["en", "ha", "yo", "pcm"].includes(parsed.language as Language)
      ? (parsed.language as Language)
      : "en";

    return {
      ...initialData,
      ...parsed,
      language: validLanguage,
      farms: Array.isArray(parsed.farms) ? parsed.farms : [],
      ponds: Array.isArray(parsed.ponds) ? parsed.ponds : [],
      feedings: Array.isArray(parsed.feedings) ? parsed.feedings : [],
      readings: Array.isArray(parsed.readings) ? parsed.readings : [],
      listings: Array.isArray(parsed.listings) && parsed.listings.length ? parsed.listings : starterListings,
      messages: Array.isArray(parsed.messages) && parsed.messages.length ? parsed.messages : starterMessages,
    };
  } catch {
    return initialData;
  }
}

export default function App() {
  const [data, setData] = useState<AppData>(readSavedData);

  const [page, setPage] = useState<Page>(() =>
    readSavedData().user ? "dashboard" : "welcome"
  );

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [farmTab, setFarmTab] = useState("farms");

  const [showFarmForm, setShowFarmForm] = useState(false);
  const [showPondForm, setShowPondForm] = useState(false);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [showReadingForm, setShowReadingForm] = useState(false);

  const [selectedFarm, setSelectedFarm] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [chatText, setChatText] = useState("");
  const [toast, setToast] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Track | "">("");

  const [loginEmail, setLoginEmail] = useState(
    safeStorageGet("fishlink-remembered-email") || ""
  );

  const t = (key: string) =>
    translations[data.language]?.[key] ?? translations.en[key] ?? key;

  useEffect(() => {
    safeStorageSet("fishlink-data-v2", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 2800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message: string) => setToast(message);

  const update = (changes: Partial<AppData>) =>
    setData((old) => ({ ...old, ...changes }));

  const go = (next: Page) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeLanguage = (language: Language) =>
    update({ language });

  const totalFish = data.ponds.reduce(
    (sum, pond) => sum + pond.population,
    0
  );

  const totalFeed = data.feedings.reduce(
    (sum, record) => sum + record.amount,
    0
  );

  const farmPonds = useMemo(
    () => data.ponds.filter((pond) => !selectedFarm || pond.farmId === selectedFarm),
    [data.ponds, selectedFarm],
  );

  const recentFeedings = useMemo(
    () =>
      [...data.feedings]
        .filter((record) =>
          farmPonds.some((pond) => pond.id === record.pondId)
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [data.feedings, farmPonds]
  );

  const recentReadings = useMemo(
    () =>
      [...data.readings]
        .filter((record) =>
          farmPonds.some((pond) => pond.id === record.pondId)
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [data.readings, farmPonds]
  );

  // AUTHENTICATION

  const handleAuth = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const password = String(form.get("password") || "");
    const role = String(form.get("role") || "").trim();
    const otherRole = String(form.get("otherRole") || "").trim();

    if (!email || !password || (authMode === "register" && !name)) {
      notify("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      notify("Password must contain at least 6 characters.");
      return;
    }

    if (authMode === "register" && !role) {
      notify("Please select your FishLink track.");
      return;
    }

    if (authMode === "register" && role === "Other" && !otherRole) {
      notify("Please specify your category.");
      return;
    }

    if (rememberMe) {
      safeStorageSet("fishlink-remembered-email", email);
    } else {
      safeStorageRemove("fishlink-remembered-email");
    }

    const user: User = {
      name: name || email.split("@")[0],
      email,
      phone,
      role:
        authMode === "register"
          ? role
          : data.user?.role || "Fish Farmer",
      otherRole:
        authMode === "register"
          ? otherRole
          : data.user?.otherRole,
    };

    update({ user });

    go("dashboard");

    notify(
      authMode === "register"
        ? "Welcome to FishLink!"
        : "Welcome back!"
    );
  };

  const continueAsGuest = (role: Track = "Individual") => {
    update({
      user: {
        name: "Guest",
        email: "",
        role,
        guest: true,
      },
    });

    go("dashboard");

    notify("You are exploring FishLink as a guest.");
  };

  const logout = () => {
    update({ user: null });

    setShowPassword(false);

    go("welcome");

    notify("You have logged out.");
  };

  // FARM MANAGEMENT

  const addFarm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("farmName") || "").trim();
    const location = String(form.get("location") || "").trim();

    if (!name || !location) return;

    const farm = {
      id: makeId(),
      name,
      location,
    };

    update({
      farms: [...data.farms, farm],
    });

    setSelectedFarm(farm.id);
    setShowFarmForm(false);

    event.currentTarget.reset();

    notify("Farm added.");
  };

  const addPond = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const farmId = String(form.get("farmId") || "");
    const name = String(form.get("pondName") || "").trim();
    const population = Number(form.get("population"));
    const length = Number(form.get("length"));
    const width = Number(form.get("width"));

    if (
      !farmId ||
      !name ||
      population <= 0 ||
      length <= 0 ||
      width <= 0
    ) {
      notify("Enter valid pond information.");
      return;
    }

    const pond: Pond = {
      id: makeId(),
      farmId,
      name,
      population,
      length,
      width,
      status: "Active",
    };

    update({
      ponds: [...data.ponds, pond],
    });

    setSelectedFarm(farmId);
    setShowPondForm(false);

    event.currentTarget.reset();

    notify("Pond added.");
  };

  const deleteFarm = (id: string) => {
    if (!window.confirm("Delete this farm and its records?")) return;

    const pondIds = data.ponds
      .filter((pond) => pond.farmId === id)
      .map((pond) => pond.id);

    update({
      farms: data.farms.filter((farm) => farm.id !== id),
      ponds: data.ponds.filter((pond) => pond.farmId !== id),
      feedings: data.feedings.filter(
        (record) => !pondIds.includes(record.pondId)
      ),
      readings: data.readings.filter(
        (record) => !pondIds.includes(record.pondId)
      ),
    });

    if (selectedFarm === id) setSelectedFarm("");

    notify("Farm deleted.");
  };

  const deletePond = (id: string) => {
    if (!window.confirm("Delete this pond and its records?")) return;

    update({
      ponds: data.ponds.filter((pond) => pond.id !== id),
      feedings: data.feedings.filter(
        (record) => record.pondId !== id
      ),
      readings: data.readings.filter(
        (record) => record.pondId !== id
      ),
    });

    notify("Pond deleted.");
  };

  // PRODUCTION

  const addFeeding = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const pondId = String(form.get("pondId") || "");
    const amount = Number(form.get("amount"));
    const date = String(form.get("date") || today());

    if (!pondId || amount <= 0) {
      notify("Choose a pond and enter a valid feed amount.");
      return;
    }

    update({
      feedings: [
        ...data.feedings,
        {
          id: makeId(),
          pondId,
          amount,
          date,
        },
      ],
    });

    setShowFeedForm(false);

    event.currentTarget.reset();

    notify("Feeding record saved.");
  };

  // WATER MONITORING

  const addReading = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const pondId = String(form.get("pondId") || "");
    const temperature = Number(form.get("temperature"));
    const oxygen = Number(form.get("oxygen"));
    const ph = Number(form.get("ph"));
    const level = Number(form.get("level"));

    if (
      !pondId ||
      [temperature, oxygen, ph, level].some(
        (value) => !Number.isFinite(value) || value < 0
      )
    ) {
      notify("Enter valid water readings.");
      return;
    }

    update({
      readings: [
        ...data.readings,
        {
          id: makeId(),
          pondId,
          temperature,
          oxygen,
          ph,
          level,
          date: new Date().toISOString(),
        },
      ],
    });

    setShowReadingForm(false);

    event.currentTarget.reset();

    notify("Water reading saved.");
  };

  // MARKETPLACE

  const categories = [
    "All",
    "Fish",
    "Feed",
    "Fingerlings",
    "Equipment",
    "Services",
  ];

  const addListing = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("productName") || "").trim();
    const price = Number(form.get("price"));
    const listingCategory = String(
      form.get("category") || "Fish"
    );
    const description = String(
      form.get("description") || ""
    ).trim();

    if (!name || price <= 0) {
      notify("Enter a product name and valid price.");
      return;
    }

    const emoji: Record<string, string> = {
      Fish: "🐟",
      Feed: "🌾",
      Fingerlings: "🐠",
      Equipment: "⚙️",
      Services: "🛠️",
    };

    update({
      listings: [
        {
          id: makeId(),
          name,
          category: listingCategory,
          price,
          description,
          seller: data.user?.name || "FishLink Member",
          emoji: emoji[listingCategory] || "📦",
        },
        ...data.listings,
      ],
    });

    event.currentTarget.reset();

    notify("Listing published.");
  };

  const visibleListings = data.listings.filter((listing) => {
    const matchesCategory =
      category === "All" || listing.category === category;

    const term = search.toLowerCase();

    const matchesSearch =
      listing.name.toLowerCase().includes(term) ||
      listing.description.toLowerCase().includes(term) ||
      listing.seller.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  // COMMUNITY

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!chatText.trim()) return;

    update({
      messages: [
        ...data.messages,
        {
          id: makeId(),
          sender: data.user?.name || "Guest",
          role: data.user?.role || "Member",
          text: chatText.trim(),
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          mine: true,
        },
      ],
    });

    setChatText("");
  };

  // REUSABLE COMPONENTS

  const Brand = ({ dark = false }: { dark?: boolean }) => (
    <div className={`brand ${dark ? "brand-dark" : ""}`}>
      <div className="brand-icon">🐟</div>

      <div className="brand-copy">
        <strong>
          Fish<span>Link</span>
        </strong>
        <small>{translateUiText("Connect · Learn · Grow", data.language)}</small>
      </div>
    </div>
  );

  const LanguageSelect = () => (
    <label className="language-select">
      <span>◎</span>

      <select
        aria-label="Choose language"
        value={data.language}
        onChange={(event) =>
          changeLanguage(event.target.value as Language)
        }
      >
        <option value="en">English</option>
        <option value="ha">Hausa</option>
        <option value="yo">Yoruba</option>
        <option value="pcm">Pidgin</option>
      </select>
    </label>
  );

  const Button = ({
    children,
    onClick,
    outline = false,
    type = "button",
    disabled = false,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    outline?: boolean;
    type?: "button" | "submit";
    disabled?: boolean;
  }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${
        outline ? "button-outline" : "button-primary"
      }`}
    >
      {children}
    </button>
  );

  const Metric = ({
    icon,
    label,
    value,
    sub,
  }: {
    icon: string;
    label: string;
    value: string | number;
    sub?: string;
  }) => (
    <article className="metric-card">
      <span className="metric-icon">{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
      {sub && <span className="metric-sub">{sub}</span>}
    </article>
  );

  const Empty = ({
    title,
    description,
    icon = "🌱",
  }: {
    title: string;
    description: string;
    icon?: string;
  }) => (
    <div className="empty-state">
      <span>{icon}</span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );

  const Heading = ({
    title,
    description,
    action,
  }: {
    title: string;
    description?: string;
    action?: React.ReactNode;
  }) => (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {action}
    </div>
  );

  // =====================================================
  // WELCOME SCREEN — YOUR ORIGINAL UPLOADED DESIGN
  // =====================================================

  if (page === "welcome") {
    const welcomeStyle: React.CSSProperties = {
      minHeight: "100vh",
      width: "100%",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      backgroundImage:
        "linear-gradient(180deg, rgba(0,35,62,.35), rgba(0,31,49,.08) 45%, rgba(0,30,43,.48)), url('/images/fishlink-pond.png')",

      backgroundSize: "cover",
      backgroundPosition: "center",

      color: "#fff",
      fontFamily: "'DM Sans', Arial, sans-serif",
    };

    const welcomeOverlay: React.CSSProperties = {
      position: "absolute",
      inset: 0,

      background:
        "linear-gradient(180deg, rgba(0,39,65,.35) 0%, rgba(0,55,75,.05) 45%, rgba(0,32,49,.35) 100%)",

      pointerEvents: "none",
    };

    const welcomeContent: React.CSSProperties = {
      position: "relative",
      zIndex: 1,
      width: "100%",
      maxWidth: 460,
      minHeight: "100vh",
      padding: "22px 25px 28px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };

    const logo: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 25,
    };

    const logoMark: React.CSSProperties = {
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: "linear-gradient(145deg, #08b7d4, #05a879)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 32,
      boxShadow: "0 5px 20px rgba(0,0,0,.2)",
    };

    const logoName: React.CSSProperties = {
      fontSize: 34,
      fontWeight: 800,
      letterSpacing: "-1.5px",
      lineHeight: 1,
    };

    const primaryButton: React.CSSProperties = {
      width: "100%",
      height: 49,
      border: "none",
      borderRadius: 28,
      background: "linear-gradient(100deg, #08c98b, #08a879)",
      color: "#fff",
      fontSize: 15,
      fontWeight: 800,
      cursor: "pointer",
      boxShadow: "0 6px 18px rgba(0,0,0,.16)",
    };

    const secondaryButton: React.CSSProperties = {
      ...primaryButton,
      background: "rgba(0,30,55,.35)",
      border: "2px solid #05c5c4",
      boxShadow: "none",
    };

    return (
      <LocalizedTree language={data.language}>
      <main style={welcomeStyle}>
        <div style={welcomeOverlay} />

        <div style={welcomeContent}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 12,
            }}
          >
            <select
              value={data.language}
              onChange={(event) =>
                changeLanguage(event.target.value as Language)
              }
              aria-label="Select language"
              style={{
                background: "rgba(0,35,57,.65)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.45)",
                borderRadius: 20,
                padding: "8px 12px",
                outline: "none",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <option style={{ color: "#123" }} value="en">
                English
              </option>

              <option style={{ color: "#123" }} value="ha">
                Hausa
              </option>

              <option style={{ color: "#123" }} value="yo">
                Yoruba
              </option>

              <option style={{ color: "#123" }} value="pcm">
                Pidgin
              </option>
            </select>
          </div>

          <div style={logo}>
            <div style={logoMark}>🐟</div>

            <div>
              <div style={logoName}>
                Fish
                <span style={{ color: "#08c99a" }}>Link</span>
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: ".4px",
                  marginTop: 5,
                  color: "#e5f7f7",
                }}
              >
                Connect · Learn · Grow
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: 47,
              maxWidth: 340,
              textShadow: "0 2px 7px rgba(0,0,0,.25)",
            }}
          >
            <h1
              style={{
                fontSize: 22,
                lineHeight: 1.35,
                fontWeight: 800,
                margin: "0 0 14px",
              }}
            >
              {t("welcome")}
            </h1>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                margin: 0,
                color: "#f0fbff",
                fontWeight: 500,
              }}
            >
              {t("description")}
            </p>
          </div>

          <div style={{ flex: 1, minHeight: 100 }} />

          <div
            style={{
              width: "100%",
              display: "grid",
              gap: 10,
            }}
          >
            <button
              style={primaryButton}
              onClick={() => {
                setAuthMode("register");
                setShowPassword(false);
                setSelectedRole("");
                go("auth");
              }}
            >
              {t("getStarted")}
            </button>

            <button
              style={secondaryButton}
              onClick={() => {
                setAuthMode("login");
                setShowPassword(false);
                go("auth");
              }}
            >
              {t("login")}
            </button>
          </div>
        </div>
      </main>
      </LocalizedTree>
    );
  }

  // =====================================================
  // LOGIN AND REGISTRATION
  // =====================================================

  if (page === "auth") {
    return (
      <LocalizedTree language={data.language}>
      <main className="auth-screen">
        <header className="auth-header">
          <button
            className="back-button"
            onClick={() => go("welcome")}
          >
            ← Back
          </button>

          <LanguageSelect />
        </header>

        <section className="auth-card">
          <Brand dark />

          <span className="eyebrow">CONNECT · LEARN · GROW</span>

          <h1>
            {authMode === "login"
              ? "Welcome Back"
              : "Create Account"}
          </h1>

          <p>
            {authMode === "login"
              ? "Sign in to your FishLink account."
              : "Join FishLink and grow with the fish farming community."}
          </p>

          <form className="auth-form" onSubmit={handleAuth}>
            {authMode === "register" && (
              <>
                <label>
                  Full Name
                  <input
                    name="name"
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                  />
                </label>

                <div className="role-selection">
                  <label>How are you joining FishLink?</label>

                  <p className="role-description">
                    Choose the track that best describes you.
                  </p>

                  <div className="role-grid">
                    {accountTypes.map((role) => {
                      const icons: Record<Track, string> = {
                        "Fish Farmer": "🐟",
                        "Veterinary Doctor": "🩺",
                        "Seller / Supplier": "🛒",
                        Enthusiast: "🌱",
                        Individual: "👤",
                        Other: "✨",
                      };

                      return (
                        <label
                          className={`role-option ${
                            selectedRole === role ? "selected" : ""
                          }`}
                          key={role}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role}
                            checked={selectedRole === role}
                            onChange={() => setSelectedRole(role)}
                            required
                          />

                          <span className="role-icon">
                            {icons[role]}
                          </span>

                          <span>{role}</span>
                        </label>
                      );
                    })}
                  </div>

                  {selectedRole === "Other" && (
                    <label className="other-role-field">
                      Specify your category

                      <input
                        name="otherRole"
                        placeholder="e.g. Researcher, Student, Investor"
                        required
                      />
                    </label>
                  )}
                </div>
              </>
            )}

            <label>
              Email Address

              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={loginEmail}
                onChange={(event) =>
                  setLoginEmail(event.target.value)
                }
                required
              />
            </label>

            <label className="password-field">
              Password

              <div className="password-input-wrap">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  placeholder="At least 6 characters"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((old) => !old)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {authMode === "login" && (
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />

                Remember me
              </label>
            )}

            <button
              className="button button-primary"
              type="submit"
            >
              {authMode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            {authMode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              onClick={() => {
                setAuthMode(
                  authMode === "login" ? "register" : "login"
                );
                setSelectedRole("");
                setShowPassword(false);
              }}
            >
              {authMode === "login" ? "Sign Up" : "Login"}
            </button>
          </div>

          <button
            className="guest-link auth-guest"
            onClick={() => continueAsGuest("Individual")}
          >
            Continue as Guest →
          </button>

          <div className="local-note">
            FishLink prototype: account details and farm records
            are stored locally in this browser. Secure authentication
            and cross-device accounts require the backend.
          </div>
        </section>
      </main>
      </LocalizedTree>
    );
  }

  // =====================================================
  // MAIN APPLICATION NAVIGATION
  // =====================================================

  const navItems: {
    id: Page;
    label: string;
    icon: string;
  }[] = [
    {
      id: "dashboard",
      label: t("dashboard"),
      icon: "⌂",
    },
    {
      id: "farms",
      label: t("farms"),
      icon: "🏡",
    },
    {
      id: "marketplace",
      label: t("marketplace"),
      icon: "🛒",
    },
    {
      id: "community",
      label: t("community"),
      icon: "💬",
    },
    {
      id: "profile",
      label: t("profile"),
      icon: "👤",
    },
  ];

  const currentRole =
    data.user?.role === "Other" && data.user.otherRole
      ? data.user.otherRole
      : data.user?.role || "FishLink Member";

  const dashboardRole =
    data.user?.role === "Other" && data.user.otherRole
      ? data.user.otherRole
      : data.user?.role || "Individual";

  const isFarmer = data.user?.role === "Fish Farmer";
  const isSeller = data.user?.role === "Seller / Supplier";
  const isDoctor = data.user?.role === "Veterinary Doctor";

  return (
    <LocalizedTree language={data.language}>
    <div className="app-shell">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <Brand />

        <div className="sidebar-label">MAIN MENU</div>

        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                page === item.id ? "active" : ""
              }`}
              onClick={() => go(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <span className="user-avatar">
            {data.user?.name.charAt(0).toUpperCase() || "F"}
          </span>

          <div>
            <strong>{data.user?.name || "Guest"}</strong>
            <small>{currentRole}</small>
          </div>
        </div>

        <button
          className="nav-item logout-button"
          onClick={logout}
        >
          <span className="nav-icon">↪</span>
          {t("logout")}
        </button>
      </aside>

      {/* MAIN CONTENT */}

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand">
            <Brand dark />
          </div>

          <span className="topbar-title">
            FishLink / {t(page)}
          </span>

          <div className="topbar-right">
            <LanguageSelect />

            <button
              className="avatar-button"
              onClick={() => go("profile")}
              aria-label="Open profile"
            >
              {data.user?.name.charAt(0).toUpperCase() || "G"}
            </button>
          </div>
        </header>

        <div className="page-content">
          {/* DASHBOARD */}

          {page === "dashboard" && (
            <>
              <section className="dashboard-banner">
                <div>
                  <span>YOUR FISHLINK WORKSPACE</span>

                  <h1>
                    Welcome, {data.user?.name || "Guest"}!
                  </h1>

                  <p>
                    {trackDescriptions[dashboardRole] ||
                      trackDescriptions.Other}
                  </p>

                  <span className="track-chip">
                    {currentRole}
                  </span>
                </div>

                <div className="banner-fish">🐟</div>
              </section>

              {isFarmer ? (
                <>
                  <div className="metric-grid">
                    <Metric
                      icon="🏡"
                      label="My Farms"
                      value={data.farms.length}
                    />

                    <Metric
                      icon="🐟"
                      label="Total Ponds"
                      value={data.ponds.length}
                    />

                    <Metric
                      icon="🐠"
                      label="Fish Population"
                      value={totalFish.toLocaleString()}
                    />

                    <Metric
                      icon="🌾"
                      label="Total Feed"
                      value={`${totalFeed} kg`}
                    />
                  </div>

                  <section className="panel">
                    <div className="panel-heading">
                      <div>
                        <h2>Water Quality Overview</h2>
                        <p>Latest recorded water reading</p>
                      </div>

                      <Button
                        outline
                        onClick={() => {
                          setFarmTab("water");
                          go("farms");
                        }}
                      >
                        View
                      </Button>
                    </div>

                    {recentReadings.length === 0 ? (
                      <Empty
                        title="No water readings yet"
                        description="Add a reading under My Farms → Water Monitoring."
                        icon="💧"
                      />
                    ) : (
                      <div className="metric-grid">
                        <Metric
                          icon="🌡️"
                          label="Temperature"
                          value={`${recentReadings[0].temperature}°C`}
                        />

                        <Metric
                          icon="💨"
                          label="Dissolved Oxygen"
                          value={`${recentReadings[0].oxygen} mg/L`}
                        />

                        <Metric
                          icon="💧"
                          label="pH Level"
                          value={recentReadings[0].ph}
                        />

                        <Metric
                          icon="🌊"
                          label="Water Level"
                          value={`${recentReadings[0].level} m`}
                        />
                      </div>
                    )}
                  </section>
                </>
              ) : isSeller ? (
                <div className="metric-grid">
                  <Metric
                    icon="🛒"
                    label="My Listings"
                    value={
                      data.listings.filter(
                        (item) => item.seller === data.user?.name
                      ).length
                    }
                  />

                  <Metric
                    icon="📦"
                    label="Categories"
                    value={5}
                  />

                  <Metric
                    icon="👥"
                    label="Potential Customers"
                    value="Explore"
                  />

                  <Metric
                    icon="📈"
                    label="Marketplace"
                    value="Open"
                  />
                </div>
              ) : isDoctor ? (
                <div className="metric-grid">
                  <Metric icon="🩺" label="Health Topics" value={3} />
                  <Metric
                    icon="👥"
                    label="Farmers"
                    value={data.farms.length}
                  />
                  <Metric
                    icon="💬"
                    label="Community"
                    value={data.messages.length}
                  />
                  <Metric
                    icon="📚"
                    label="Resources"
                    value="Explore"
                  />
                </div>
              ) : (
                <div className="metric-grid">
                  {(trackMetrics[dashboardRole] ||
                    trackMetrics.Other).map((label, index) => (
                    <Metric
                      key={label}
                      icon={["🌱", "💬", "🛒", "📚"][index % 4]}
                      label={label}
                      value={
                        index === 0 ? data.farms.length : "Explore"
                      }
                    />
                  ))}
                </div>
              )}

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Explore FishLink</h2>
                    <p>Choose where you want to go next.</p>
                  </div>
                </div>

                <div className="quick-grid">
                  <button onClick={() => go("farms")}>
                    <span>🏡</span>
                    <strong>My Farms</strong>
                    <small>Manage ponds and production</small>
                  </button>

                  <button onClick={() => go("marketplace")}>
                    <span>🛒</span>
                    <strong>Marketplace</strong>
                    <small>Discover products and services</small>
                  </button>

                  <button onClick={() => go("community")}>
                    <span>💬</span>
                    <strong>Community</strong>
                    <small>Connect and learn together</small>
                  </button>
                </div>
              </section>

              {isFarmer && (
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>My Farms</h2>
                      <p>Your registered farms</p>
                    </div>

                    <Button onClick={() => go("farms")}>
                      View Farms
                    </Button>
                  </div>

                  {data.farms.length === 0 ? (
                    <Empty
                      title="No farms added yet"
                      description="Add your first farm to begin managing your fish farming activities."
                      icon="🏡"
                    />
                  ) : (
                    data.farms.slice(0, 4).map((farm) => (
                      <div className="record-row" key={farm.id}>
                        <span className="record-icon">🏡</span>

                        <div className="record-main">
                          <strong>{farm.name}</strong>
                          <small>{farm.location}</small>
                        </div>

                        <strong>
                          {
                            data.ponds.filter(
                              (pond) => pond.farmId === farm.id
                            ).length
                          }{" "}
                          ponds
                        </strong>
                      </div>
                    ))
                  )}
                </section>
              )}
            </>
          )}

          {/* MY FARMS */}

          {page === "farms" && (
            <>
              <Heading
                title="My Farms"
                description="Manage farms, ponds, production and water quality."
                action={
                  farmTab === "farms" ? (
                    <Button
                      onClick={() =>
                        setShowFarmForm((old) => !old)
                      }
                    >
                      + {t("addFarm")}
                    </Button>
                  ) : farmTab === "ponds" ? (
                    <Button
                      disabled={!data.farms.length}
                      onClick={() =>
                        setShowPondForm((old) => !old)
                      }
                    >
                      + {t("addPond")}
                    </Button>
                  ) : null
                }
              />

              <div className="subnav">
                {[
                  ["farms", "Farms"],
                  ["ponds", "Ponds"],
                  ["production", "Production"],
                  ["water", "Water Monitoring"],
                  ["simulation", "Pond Simulation"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    className={farmTab === id ? "chosen" : ""}
                    onClick={() => {
                      setFarmTab(id);
                      setShowFarmForm(false);
                      setShowPondForm(false);
                      setShowFeedForm(false);
                      setShowReadingForm(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* FARMS TAB */}

              {farmTab === "farms" && (
                <>
                  {showFarmForm && (
                    <form
                      className="entry-form"
                      onSubmit={addFarm}
                    >
                      <h3>Add a Farm</h3>

                      <label>
                        Farm Name
                        <input
                          name="farmName"
                          placeholder="e.g. Green Valley Farm"
                          required
                        />
                      </label>

                      <label>
                        Location
                        <input
                          name="location"
                          placeholder="Farm location"
                          required
                        />
                      </label>

                      <div className="form-actions">
                        <Button type="submit">Save Farm</Button>

                        <Button
                          outline
                          onClick={() => setShowFarmForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  {data.farms.length === 0 ? (
                    <Empty
                      title="No farms added yet"
                      description="Add your first farm to get started."
                      icon="🏡"
                    />
                  ) : (
                    data.farms.map((farm) => {
                      const ponds = data.ponds.filter(
                        (pond) => pond.farmId === farm.id
                      );

                      const fish = ponds.reduce(
                        (sum, pond) => sum + pond.population,
                        0
                      );

                      return (
                        <article
                          className="farm-block"
                          key={farm.id}
                        >
                          <div className="farm-block-heading">
                            <span className="farm-landscape">
                              🏞️
                            </span>

                            <div>
                              <strong>{farm.name}</strong>
                              <small>{farm.location}</small>
                            </div>

                            <button
                              className="delete-icon"
                              onClick={() => deleteFarm(farm.id)}
                              aria-label={`Delete ${farm.name}`}
                            >
                              ×
                            </button>
                          </div>

                          <div className="metric-grid compact">
                            <Metric
                              icon="🐟"
                              label="Ponds"
                              value={ponds.length}
                            />

                            <Metric
                              icon="🐠"
                              label="Fish"
                              value={fish.toLocaleString()}
                            />
                          </div>

                          <Button
                            outline
                            onClick={() => {
                              setSelectedFarm(farm.id);
                              setFarmTab("ponds");
                            }}
                          >
                            View Ponds →
                          </Button>
                        </article>
                      );
                    })
                  )}
                </>
              )}

              {/* PONDS TAB */}

              {farmTab === "ponds" && (
                <>
                  {showPondForm && (
                    <form
                      className="entry-form"
                      onSubmit={addPond}
                    >
                      <h3>Add a Pond</h3>

                      <label>
                        Farm

                        <select
                          name="farmId"
                          defaultValue={selectedFarm}
                          required
                        >
                          <option value="">Choose a farm</option>

                          {data.farms.map((farm) => (
                            <option
                              key={farm.id}
                              value={farm.id}
                            >
                              {farm.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Pond Name
                        <input
                          name="pondName"
                          placeholder="Pond 1"
                          required
                        />
                      </label>

                      <label>
                        Fish Population
                        <input
                          name="population"
                          type="number"
                          min="1"
                          required
                        />
                      </label>

                      <div className="form-two">
                        <label>
                          Length (m)
                          <input
                            name="length"
                            type="number"
                            min="0.1"
                            step="0.1"
                            required
                          />
                        </label>

                        <label>
                          Width (m)
                          <input
                            name="width"
                            type="number"
                            min="0.1"
                            step="0.1"
                            required
                          />
                        </label>
                      </div>

                      <div className="form-actions">
                        <Button type="submit">Save Pond</Button>

                        <Button
                          outline
                          onClick={() => setShowPondForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  <label className="filter-label">
                    Filter by farm

                    <select
                      value={selectedFarm}
                      onChange={(event) =>
                        setSelectedFarm(event.target.value)
                      }
                    >
                      <option value="">All farms</option>

                      {data.farms.map((farm) => (
                        <option
                          key={farm.id}
                          value={farm.id}
                        >
                          {farm.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {farmPonds.length === 0 ? (
                    <Empty
                      title="No ponds added yet"
                      description="Add a farm, then register its ponds."
                      icon="🐟"
                    />
                  ) : (
                    farmPonds.map((pond) => (
                      <article
                        className="pond-card"
                        key={pond.id}
                      >
                        <div className="pond-art">🐟</div>

                        <div className="pond-info">
                          <div className="pond-title">
                            <strong>{pond.name}</strong>
                            <span className="status-pill">
                              {pond.status}
                            </span>
                          </div>

                          <small>
                            {
                              data.farms.find(
                                (farm) => farm.id === pond.farmId
                              )?.name
                            }{" "}
                            · Catfish
                          </small>

                          <p>
                            {pond.population.toLocaleString()} fish ·{" "}
                            {pond.length} × {pond.width} m
                          </p>
                        </div>

                        <button
                          className="delete-icon"
                          onClick={() => deletePond(pond.id)}
                          aria-label={`Delete ${pond.name}`}
                        >
                          ×
                        </button>
                      </article>
                    ))
                  )}
                </>
              )}

              {/* PRODUCTION TAB */}

              {farmTab === "production" && (
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Feeding Records</h2>
                      <p>
                        Track feed quantities and feeding dates.
                      </p>
                    </div>

                    <Button
                      disabled={!data.ponds.length}
                      onClick={() =>
                        setShowFeedForm((old) => !old)
                      }
                    >
                      + Record Feeding
                    </Button>
                  </div>

                  {showFeedForm && (
                    <form
                      className="entry-form"
                      onSubmit={addFeeding}
                    >
                      <h3>Record Feeding</h3>

                      <label>
                        Pond

                        <select
                          name="pondId"
                          required
                          defaultValue=""
                        >
                          <option value="">Choose a pond</option>

                          {data.ponds.map((pond) => (
                            <option
                              key={pond.id}
                              value={pond.id}
                            >
                              {pond.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Feed Quantity (kg)

                        <input
                          name="amount"
                          type="number"
                          min="0.1"
                          step="0.1"
                          required
                        />
                      </label>

                      <label>
                        Date

                        <input
                          name="date"
                          type="date"
                          defaultValue={today()}
                          required
                        />
                      </label>

                      <div className="form-actions">
                        <Button type="submit">
                          Save Record
                        </Button>

                        <Button
                          outline
                          onClick={() => setShowFeedForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  {recentFeedings.length === 0 ? (
                    <Empty
                      title="No feeding records"
                      description="Record your first feeding activity."
                      icon="🌾"
                    />
                  ) : (
                    recentFeedings.map((record) => (
                      <div
                        className="record-row"
                        key={record.id}
                      >
                        <span className="record-icon">🌾</span>

                        <div className="record-main">
                          <strong>
                            {
                              data.ponds.find(
                                (pond) => pond.id === record.pondId
                              )?.name
                            }
                          </strong>

                          <small>{record.date}</small>
                        </div>

                        <strong>{record.amount} kg</strong>
                      </div>
                    ))
                  )}
                </section>
              )}

              {/* WATER MONITORING TAB */}

              {farmTab === "water" && (
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Water Monitoring</h2>
                      <p>Record water quality measurements.</p>
                    </div>

                    <Button
                      disabled={!data.ponds.length}
                      onClick={() =>
                        setShowReadingForm((old) => !old)
                      }
                    >
                      + Add Reading
                    </Button>
                  </div>

                  {showReadingForm && (
                    <form
                      className="entry-form"
                      onSubmit={addReading}
                    >
                      <h3>New Water Reading</h3>

                      <label>
                        Pond

                        <select
                          name="pondId"
                          required
                          defaultValue=""
                        >
                          <option value="">Choose a pond</option>

                          {data.ponds.map((pond) => (
                            <option
                              key={pond.id}
                              value={pond.id}
                            >
                              {pond.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="form-two">
                        <label>
                          Temperature (°C)

                          <input
                            name="temperature"
                            type="number"
                            step="0.1"
                            required
                          />
                        </label>

                        <label>
                          Dissolved Oxygen (mg/L)

                          <input
                            name="oxygen"
                            type="number"
                            step="0.1"
                            required
                          />
                        </label>

                        <label>
                          pH

                          <input
                            name="ph"
                            type="number"
                            step="0.1"
                            required
                          />
                        </label>

                        <label>
                          Water Level (m)

                          <input
                            name="level"
                            type="number"
                            step="0.1"
                            required
                          />
                        </label>
                      </div>

                      <div className="form-actions">
                        <Button type="submit">
                          Save Reading
                        </Button>

                        <Button
                          outline
                          onClick={() => setShowReadingForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  {recentReadings.length === 0 ? (
                    <Empty
                      title="No water readings"
                      description="Add a reading manually. Sensor data can be integrated later."
                      icon="💧"
                    />
                  ) : (
                    recentReadings.map((reading) => (
                      <div
                        className="record-row"
                        key={reading.id}
                      >
                        <span className="record-icon">💧</span>

                        <div className="record-main">
                          <strong>
                            {
                              data.ponds.find(
                                (pond) => pond.id === reading.pondId
                              )?.name
                            }
                          </strong>

                          <small>
                            {new Date(reading.date).toLocaleString()}
                          </small>

                          <small>
                            {reading.temperature}°C ·{" "}
                            {reading.oxygen} mg/L DO · pH{" "}
                            {reading.ph} · {reading.level} m
                          </small>
                        </div>
                      </div>
                    ))
                  )}

                  <div className="notice">
                    These readings are entered manually. ESP32 sensor
                    integration can be added later.
                  </div>
                </section>
              )}

              {/* POND SIMULATION TAB: animation is supplied by the simulation team */}
              {farmTab === "simulation" && (
                <PondSimulation
                  farms={data.farms}
                  ponds={data.ponds}
                  language={data.language}
                />
              )}
            </>
          )}

          {/* MARKETPLACE */}

          {page === "marketplace" && (
            <>
              <Heading
                title="Marketplace"
                description="Discover fish, feed, fingerlings, equipment and farming services."
              />

              <section className="panel">
                <input
                  className="search-box"
                  placeholder="Search products and services..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

                <div className="category-grid">
                  {categories.map((item) => (
                    <button
                      key={item}
                      className={`category-button ${
                        category === item ? "chosen" : ""
                      }`}
                      onClick={() => setCategory(item)}
                    >
                      <span>
                        {
                          {
                            All: "🌐",
                            Fish: "🐟",
                            Feed: "🌾",
                            Fingerlings: "🐠",
                            Equipment: "⚙️",
                            Services: "🛠️",
                          }[item]
                        }
                      </span>

                      {item}
                    </button>
                  ))}
                </div>

                {isSeller && (
                  <form
                    className="entry-form"
                    onSubmit={addListing}
                  >
                    <h3>Publish a Listing</h3>

                    <label>
                      Product or Service

                      <input
                        name="productName"
                        required
                        placeholder="What are you selling?"
                      />
                    </label>

                    <div className="form-two">
                      <label>
                        Category

                        <select name="category">
                          {categories
                            .filter((item) => item !== "All")
                            .map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                        </select>
                      </label>

                      <label>
                        Price (₦)

                        <input
                          name="price"
                          type="number"
                          min="1"
                          required
                        />
                      </label>
                    </div>

                    <label>
                      Description

                      <input
                        name="description"
                        placeholder="Product details"
                      />
                    </label>

                    <Button type="submit">
                      Publish Listing
                    </Button>
                  </form>
                )}

                <div className="panel-heading">
                  <div>
                    <h2>Featured Products</h2>
                    <p>
                      {visibleListings.length} items available
                    </p>
                  </div>
                </div>

                {visibleListings.length === 0 ? (
                  <Empty
                    title="No matching products"
                    description="Try another category or search."
                    icon="🛒"
                  />
                ) : (
                  <div className="listing-grid">
                    {visibleListings.map((listing) => (
                      <article
                        className="listing-card"
                        key={listing.id}
                      >
                        <div className="listing-art">
                          {listing.emoji}
                        </div>

                        <div className="listing-body">
                          <span className="category-pill">
                            {listing.category}
                          </span>

                          <h3>{listing.name}</h3>

                          <p>{listing.description}</p>

                          <strong>{money(listing.price)}</strong>

                          <small>
                            Seller: {listing.seller}
                          </small>

                          <Button
                            outline
                            onClick={() =>
                              notify(
                                "Seller contact and ordering will be enabled with the backend."
                              )
                            }
                          >
                            Contact Seller
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                <div className="notice">
                  Featured products are illustrative prototype listings,
                  not verified live seller offers.
                </div>
              </section>
            </>
          )}

          {/* COMMUNITY */}

          {page === "community" && (
            <>
              <Heading
                title="Community"
                description="Connect with farmers, experts and fish farming professionals."
              />

              <section className="community-banner">
                <span>🌱</span>

                <div>
                  <h2>Grow Together</h2>

                  <p>
                    Share experiences, ask questions and learn from
                    the FishLink community.
                  </p>
                </div>
              </section>

              <section className="panel">
                <div className="chat-heading">
                  <span className="record-icon">💬</span>

                  <div>
                    <h2>Farmers Group</h2>
                    <small>
                      Community preview · Local prototype
                    </small>
                  </div>
                </div>

                <div className="chat-messages">
                  {data.messages.map((message) => (
                    <div
                      className={`chat-message ${
                        message.mine ? "mine" : ""
                      }`}
                      key={message.id}
                    >
                      <strong>
                        {message.sender}{" "}
                        <small>{message.role}</small>
                      </strong>

                      <p>{message.text}</p>

                      <small>{message.date}</small>
                    </div>
                  ))}
                </div>

                <form
                  className="chat-form"
                  onSubmit={sendMessage}
                >
                  <input
                    value={chatText}
                    onChange={(event) =>
                      setChatText(event.target.value)
                    }
                    placeholder="Write a message..."
                    aria-label="Community message"
                  />

                  <Button type="submit">Send ➤</Button>
                </form>
              </section>

              <section className="panel ai-panel">
                <div className="ai-icon">🤖</div>

                <div>
                  <h2>FishLink AI Assistant</h2>

                  <p>
                    Ask about feeding, water quality, catfish growth
                    and pond management.
                  </p>

                  <Button
                    onClick={() =>
                      notify(
                        "AI answers will be enabled when an AI backend is connected."
                      )
                    }
                  >
                    Open AI Assistant
                  </Button>
                </div>
              </section>
            </>
          )}

          {/* PROFILE */}

          {page === "profile" && (
            <>
              <Heading
                title="My Profile"
                description="Your FishLink account and preferences."
              />

              <section className="panel">
                <div className="profile-intro">
                  <span className="profile-avatar">
                    {data.user?.name.charAt(0).toUpperCase() || "G"}
                  </span>

                  <div>
                    <h2>{data.user?.name || "Guest"}</h2>

                    <p>{currentRole}</p>

                    <small>
                      {data.user?.email || "Guest account"}
                    </small>

                    {data.user?.phone && (
                      <small>{data.user.phone}</small>
                    )}
                  </div>
                </div>

                <div className="settings-row">
                  <span>Account type</span>

                  <strong>
                    {data.user?.guest
                      ? "Guest"
                      : "Registered prototype"}
                  </strong>
                </div>

                <div className="settings-row">
                  <span>Language</span>
                  <LanguageSelect />
                </div>

                <div className="settings-row">
                  <span>Farms</span>
                  <strong>{data.farms.length}</strong>
                </div>

                <div className="settings-row">
                  <span>Ponds</span>
                  <strong>{data.ponds.length}</strong>
                </div>

                <div className="settings-row">
                  <span>Fish Population</span>
                  <strong>{totalFish.toLocaleString()}</strong>
                </div>

                <Button
                  outline
                  onClick={() => go("farms")}
                >
                  Manage My Farms
                </Button>

                <button
                  className="button button-outline logout-full danger"
                  onClick={logout}
                >
                    {t("logout")}
                </button>
              </section>
            </>
          )}

          <footer className="app-footer">
            FishLink · Connect · Learn · Grow
          </footer>
        </div>
      </main>

      {/* MOBILE NAVIGATION */}

      <nav className="mobile-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={page === item.id ? "active" : ""}
            onClick={() => go(item.id)}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>

      {/* NOTIFICATIONS */}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
    </LocalizedTree>
  );
}