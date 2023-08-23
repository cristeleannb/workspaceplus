//
//  Dynamic.swift
//  FWDWorkspace
//
//  Created by Jun Rey Ellezo on 9/12/21.
//

import UIKit
import Foundation
import Lottie

@objc class Dynamic: NSObject {

  @objc func createAnimationView(rootView: UIView, lottieName: String) -> AnimationView {
    let backgroundColor = UIColor(red: 0.91, green: 0.47, blue: 0.13, alpha: 1.00)
    let animationView = AnimationView(name: lottieName)
    animationView.frame = rootView.frame
    animationView.backgroundColor = backgroundColor
    animationView.loopMode = .loop
    animationView.translatesAutoresizingMaskIntoConstraints = false
    animationView.contentMode = .scaleAspectFit
    animationView.bounds = animationView.frame.insetBy(dx: 40.0, dy: 0.0);
    return animationView;
  }

  @objc func play(animationView: AnimationView) {
    animationView.play();
  }
}
