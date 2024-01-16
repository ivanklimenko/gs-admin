import React from "react";
import { TitleProps } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-react-router-v6";

const { Link } = routerProvider;

export const Title: React.FC<TitleProps> = ({ collapsed }) => (
  <Link to="/">
    {collapsed ? (
      <h1 style={{color: 'white', padding: '6px 10px', fontSize: '24px', textAlign: 'center'}}>
        HN
      </h1>
      // <img
      //   src={"/refine-collapsed.svg"}
      //   alt="Refine"
      //   style={{
      //     display: "flex",
      //     alignItems: "center",
      //     justifyContent: "center",
      //     padding: "12px 24px",
      //   }}
      // />
    ) : (
      <h1 style={{color: 'white', padding: '6px 10px', fontSize: '24px', textAlign: 'center'}}>
        HungryNinja
      </h1>
      // <img
      //   src={"/refine.svg"}
      //   alt="Refine"
      //   style={{
      //     width: "200px",
      //     padding: "12px 24px",
      //   }}
      // />
    )}
  </Link>
);