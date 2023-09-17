#lang slideshow/widescreen

(require slideshow/play)
(require 2htdp/image)
(require spd/tags)

(@htdf transition-image)
(@signature Image -> Image)
;; transition one image

; (define (transition-image img) img) ; stub

(define (transition-image img)
  (play-n
   (lambda (n1 n2) (cellophane img
                              (* n1 (- 1.0 n2))))))


(current-main-font "Whitney")

(slide (titlet "Treescapes")
       (scale (/ 1 10) (bitmap "treescapes.png"))
       (it "Andrew Mao & Randy Zhu"))

(slide (titlet "The Problem")
       (beside (bitmap "sadman.jpg")
               (bitmap "hidethepain.jpeg")))

(slide (titlet "Canvas/Quercus/LEARN/BrightSpace/LMS?")
       (scale (/ 1 3) (bitmap "canvas.png")))

(slide (titlet "Not (always) a Solution")
       (scale (/ 1 2) (bitmap "cs11 canvas.png")))

(slide (titlet "Issues")
       (t "- Not all courses use their LMS properly")
       (t "- No LMS is perfect with their features - Instructors want flexiblity")
       (t "- Different instructors have different expectations for using Canvas")
       (t "- The end result: they expect you to use conform to expectation"))

(slide (titlet "Bandaid Solution")
       (t "- Use bookmarks to store all the other sites")
       (it "- Piazza, PrarieLearn, Gradescope"))

(slide (titlet "Desktop Solution")
       (scale (/ 1 2) (bitmap "touchscreen.png")))

(slide (titlet "Mobile-First Solutions")
       (foldr beside empty-image
              (map (lambda (img) (scale (/ 1 6) img)) (list (bitmap "uiflow1.png")
                                                            (bitmap "uiflow2.png")
                                                            (bitmap "uiflow3.png")
                                                            (bitmap "uiflow4.png")
                                                            (bitmap "uiflow5.png")
                                                            (bitmap "ios bad.png")))))

(slide (titlet "Issues")
       (t "- Desktop solution: Hard to use with touchscreen (2in1 devices)")
       (t "- Mobile too small: doesn't store enough bookmarks")
       (t "- Common issue: Bad UI Flow"))

(slide (titlet "Demo"))
