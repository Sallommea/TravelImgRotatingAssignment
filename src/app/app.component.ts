import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, Subscription, interval } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private animationTrigger$ = new Subject<void>(); // observeble to use for emitting and subscribing events;
  subs: Subscription[] = []; // ამ მასივში დაიფუშება observable, რომ შემდგომ observeble subscribtion-ს unsubscribe გაუკეთდეს, memory leak-ის თავიდან ასაცილებლად
  destinations: any[] = [
    {
      name: 'Maldives',
      location: 'Indian Ocean',
      img: '../assets/maldives.jpg',
    },
    {
      name: 'Dolomites',
      location: 'Italy',
      img: '../assets/pale.jpg',
    },
    {
      name: 'Sahara',
      location: 'Marrakech',
      img: '../assets/dubaiDesret.jpg',
    },
    {
      name: 'Highland',
      location: 'Scotland',
      img: '../assets/scotland.jpg',
    },
  ];
  currentIndex: number = 0; // ინდექსი, რათა მოვინიშნოთ, რომელი ადგილია ნაჩვენები.
  currentDestination = this.destinations[this.currentIndex];
  nextDestination =
    this.destinations[(this.currentIndex + 1) % this.destinations.length];
  imgUrl = this.currentDestination.img;
  // ქვემოთ ნაჩვენებია ცვლადები  ადგილების და მათი სათაურების და შემდგომი ადგილების და სათაურების
  currentTitle: string = this.currentDestination.name;
  nextTitle: string = this.currentDestination.name;
  currentLocation: string = this.currentDestination.location;
  nextLocation: string = this.currentDestination.location;
  opacity = false;
  animatePic = false;

  constructor() {}

  ngOnInit(): void {
    this.subs.push(
      // ეს observable იწყებს ანიმაციის და სახელის და ლოკაციების განახლების პროცესს
      this.animationTrigger$
        .pipe(
          switchMap(() => interval(700).pipe(take(1))),
          tap(() => {
            // 0.6 წამის დაყოვნებით ცვლის ცვლადების მნიშვნელობებს
            this.currentDestination = this.destinations[this.currentIndex];
            this.nextDestination =
              this.destinations[
                (this.currentIndex + 1) % this.destinations.length
              ];
            this.currentTitle = this.currentDestination.name;
            this.currentLocation = this.currentDestination.location;

            this.imgUrl = this.currentDestination.img;
          }),
          switchMap(() => interval(700).pipe(take(1))),
          tap(() => {
            // 0.7 წამის დაყოვნებით ცვლის ცვლადის მნიშვნელობას და ასრულებს ანიმაციის ციკლს
            this.animatePic = false;
          }),
          switchMap(() => interval(600).pipe(take(1))),
          tap(() => {
            // 0.6 წამის დაყოვნების ახალ მნიშვნელობებს აძლევს nextTitle-ს და nextLocations-ს
            this.opacity = false;
            this.currentIndex =
              (this.currentIndex + 1) % this.destinations.length;
            this.nextTitle = this.destinations[this.currentIndex].name;
            this.nextLocation = this.destinations[this.currentIndex].location;
          })
        )
        .subscribe()
      // როდესაც ანიმაცია იწყება current title ადის ზემოთ და მის ადგილს იკავებს nextTitle,
      // როცა ანიმაცია სრულდება current title უბრუნდება თავის ადგილს, ამიტომ პროცესში nextTitle-ს მნიშვნელობას
      // იღებს currentTitle, ხოლო nextTitle იღებს შემდგომ მნიშვნელობას და ა.შ...
      // ამ პროცესს, ისევე როგორც სურათებიც ცვლას, უზრუნველყოფს this.animationTrigger$ observable
    );

    this.animate();
  }
  handleMouseWheel(event: WheelEvent): void {
    this.animate();
  }

  animate() {
    if (this.opacity) {
      return;
    }
    this.animatePic = true;
    this.opacity = true;
    this.animationTrigger$.next();
  }

  ngOnDestroy(): void {
    // memory leak-ის თავიდან ასარიდებლად ხდება unsubscribe
    this.subs.forEach((x) => x.unsubscribe);
  }
}
