/* ================================================================
   CHARACTER GUESSER - QUESTIONS DATABASE
   
   This file contains all the questions for the game.
   Add new questions by following the format below.
   
   IMPORTANT: Place all image files in assets/images/ directory
   
   Question Format:
   {
     image: "assets/images/filename.jpg",
     correctAnswer: "Character Name",
     options: [
       "Character Name",      // Must include the correct answer
       "Wrong Answer 1",
       "Wrong Answer 2",
       "Wrong Answer 3"
     ]
   }
   
   TIPS FOR ADDING QUESTIONS:
   - Ensure all image paths are correct
   - The correctAnswer MUST be one of the four options
   - Shuffle the order of options (don't put correct answer first)
   - Use consistent naming conventions
   - Test images are loading before deploying
   
   ================================================================ */

const questions = [
    // ============================================================
    // ANIME CHARACTERS (Questions 1-20)
    // ============================================================
    
    {
        image: "assets/images/1.webp",
        correctAnswer: "Tung Tung Tung Sahur",
    },

    {
        image: "assets/images/2.webp",
        correctAnswer: "Tralalelo Tralala",
    },

    {
        image: "assets/images/3.webp",
        correctAnswer: "Garam Mararam Madu Taktuntung Perkuntung",
    },

      {
        image: "assets/images/4.jpg",
        correctAnswer: "Roti Bohai Semok Semak Momomok Memek",
    },

    {
        image: "assets/images/5.webp",
        correctAnswer: "KarKirKurKarKarKar",
    },   
    
    {
        image: "assets/images/6.jpeg",
        correctAnswer: "Udindindindun Madindindindun",
    },

      {
        image: "assets/images/7.png",
        correctAnswer: "Tob Tobitob Tob Tobitob Tobi",
    },

    {
        image: "assets/images/8.png",
        correctAnswer: "Yu Yu Yu Wahyu",
    },

      {
        image: "assets/images/9.png",
        correctAnswer: "Boneca Ambalabu",
    },

     {
        image: "assets/images/10.jpg",
        correctAnswer: "Brr Es Teh Patipum",
    },

    {
        image: "assets/images/11.jfif",
        correctAnswer: "Pat Ketupat Prekupat Kepat Kepet Kepot",
    },

    {
        image: "assets/images/12.jfif",
        correctAnswer: "Pot Pot Hotspot",
    },

    {
        image: "assets/images/13.jpeg",
        correctAnswer: "Fufubaba Fufufini",
    },

    {
        image: "assets/images/14.jfif",
        correctAnswer: "KarKer Sahur",
    },

     {
        image: "assets/images/15.jfif",
        correctAnswer: "Ta Ta Ta Sahur",
    },

    {
        image: "assets/images/16.webp",
        correctAnswer: "Siti Siti Velocity",
    },

    {
        image: "assets/images/17.jpg",
        correctAnswer: "Aniesini Gusini",
    },

    {
        image: "assets/images/18.jfif",
        correctAnswer: "Tang Tang Tang Kelentang",
    },

    {
        image: "assets/images/19.jfif",
        correctAnswer: "Oplosana Oplosini",
    },

     {
        image: "assets/images/20.jpg",
        correctAnswer: "Pra Pra Pra Pra Supra Kuntul Kupra",
    },
];

/* ================================================================
   HOW TO ADD MORE QUESTIONS:
   
   1. Add images to the 'assets/images/' directory
   2. Create a new question object (you don't need to fill 'options' anymore!)
   3. Add it to the 'questions' array
   
   EXAMPLE:
   {
       image: "assets/images/my-character.jpg",
       correctAnswer: "Character Name"
   }
   
   The game will automatically:
   - Pick 3 random wrong answers from 'wrong-answers.js'
   - Combine with your correct answer
   - Shuffle all 4 options
   - Randomly select 20 questions per session
   - Prevent duplicate questions in one session
   - Handle missing images gracefully
   
   ================================================================ */
